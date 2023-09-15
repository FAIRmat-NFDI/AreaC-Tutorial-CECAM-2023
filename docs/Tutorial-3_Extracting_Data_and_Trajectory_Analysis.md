# Working with the NOMAD archive

In this part of the tutorial we will demonstrate how to query data from the NOMAD repository and work with it within a python environment.

For this demonstration, we will utilize some tools from the nomad-lab software, as well as some third-party software (e.g., MDAnalysis, nglview).

We suggest creating a virtual environment for this purpose. For example, using `conda`, you can set up an environment with the following commands:

```python
conda create -n "CECAM_tutorial" python==3.9
conda activate CECAM_tutorial
pip install nomad-lab
conda install nglview
conda install "ipywidgets <8" -c conda-forge
```

!!! note "NOTE"

        You may have to restart vscode or other editor after updating `ipywidgets`.


!!! note "NOTE"

        We stress that none of these packages are **required** to work with the NOMAD archive data. As you will see below, the archive data will be retrieved in a dictionary format, which you are free to work with in a *plain* python environment.

Now, start a Jupyter notebook to carry out the remainder of this part of the tutorial.

Import all the necessary modules:

```python
# Python
import numpy as np

# I/O
import json

# NOMAD API
import requests

# NOMAD tools
from nomad.atomutils import archive_to_universe
from nomad.atomutils import BeadGroup
from nomad.datamodel import EntryArchive
from nomad.units import ureg

# Visualization
import matplotlib.pyplot as plt
import nglview as nv

# MDAnalysis
import MDAnalysis.analysis.rdf as MDA_RDF
from MDAnalysis.analysis.distances import self_distance_array, distance_array
```

## Downloading entire entry archives

In general, you can use the [NOMAD API](https://nomad-lab.eu/prod/rae/docs/api.html) to grab particular archive entries from the repository or to search the repository for entries with certain attributes. This can be achieved in python using the `requests` module.

Let's imagine that we searched the NOMAD repository using the filter bar of the GUI, as demonstrated in [Part I](part1.md) of the tutorial, and found a [short simulation of an atomistic box of hexane molecules](https://nomad-lab.eu/prod/v1/gui/search/entries/entry/id/hxaepf6x12Xt2IX2jCt4DyfLG0P4) that we might want to reuse. Open the link for this entry for reference as we analyze the queried data.

From the Overview page of the entry, copy the `entry_id` from the left-hand side where the entry metadata is displayed. Define a variable with this information:

```python
entry_id = ## PLACE ENTRY_ID HERE
```
We also need to define the API endpoint:

```python
nomad_url = 'https://nomad-lab.eu/prod/v1/api/v1/'
```

To download the entire archive for the entry of interest, we only have to execute a single command, and then we set the response to the variable `data`:

```python
response = requests.get(nomad_url + 'entries/' + entry_id + '/archive/download')

data = response.json()
```

!!! note "NOTE"

        This should take about 7 minutes, depending on the internet.

The resulting variable `data` is a dictionary. The keys of this dictionary directly correspond to the sections that we examined in the **DATA** tab on the entry page of NOMAD in [Part III](Tutorial-1_Uploading_MD_Data.md):

```python
print(data.keys())
```

    dict_keys(['processing_logs', 'run', 'workflow2', 'metadata', 'results', 'm_ref_archives'])

### <u> **Exercise** </u>

Get the atom positions for the first frame of the trajectory from this dictionary.

**TODO - If possible, add API for grabbing particular quantity from the archive**

## Using tools from nomad-lab

### The NOMAD archive entry format

While it is perfectly acceptable to work directly with the archive dictionary, we can also convert this dictionary into the internal NOMAD archive entry format, which is slightly more convenient to work with:

```python
archive = EntryArchive.m_from_dict(data)
```

You can now access subsections with a simple `.` instead of `['']`.

Using this syntax, define some sections that will be used in the following cells:

```python
section_run = archive.run[-1]
section_system = section_run.system
section_system_topology = section_run.system[0].atoms_group
section_atoms = section_system[0].atoms
```

Recall that the section **run** &rarr; **system**  is a list containing configurational information from each frame in the trajectory. Let's extract some information about the system, including positions, velocities, and box vectors:

```python
# get the number of atoms and frames, along with the atom names.
n_atoms = section_atoms.get('n_atoms')
n_frames = len(section_system) if section_system is not None else None
atom_names = section_atoms.get('labels')

# get the atom positions, velocites, and box dimensions
positions = np.empty(shape=(n_frames, n_atoms, 3))
velocities = np.empty(shape=(n_frames, n_atoms, 3))
dimensions = np.empty(shape=(n_frames, 6))
for frame_ind, frame in enumerate(section_system):
    sec_atoms_fr = frame.get('atoms')
    if sec_atoms_fr is not None:
        positions_frame = sec_atoms_fr.positions
        positions[frame_ind] = ureg.convert(positions_frame.magnitude, positions_frame.units,
                                            ureg.angstrom) if positions_frame is not None else None
        velocities_frame = sec_atoms_fr.velocities
        velocities[frame_ind] = ureg.convert(velocities_frame.magnitude, velocities_frame.units,
                                                ureg.angstrom / ureg.picosecond) if velocities_frame is not None else None
        latt_vec_tmp = sec_atoms_fr.get('lattice_vectors')
        if latt_vec_tmp is not None:
            length_conversion = ureg.convert(1.0, sec_atoms_fr.lattice_vectors.units, ureg.angstrom)
            dimensions[frame_ind] = [
                sec_atoms_fr.lattice_vectors.magnitude[0][0] * length_conversion,
                sec_atoms_fr.lattice_vectors.magnitude[1][1] * length_conversion,
                sec_atoms_fr.lattice_vectors.magnitude[2][2] * length_conversion,
                90, 90, 90]  # nb -- for cubic box!
```
### <u> **Exercises** </u>

1. Fill in the missing variables assignments in the following code to make the temperature trajectory plot for this calculation. Compare your result to the plot from the Overview page in the NOMAD GUI.

```python
fig = plt.figure(figsize=(10,4))
section_calculation =  ## FIND THE SECTION CALCULATION IN THE ARCHIVE ##
temperature = []
time = []
temperature_unit =  ## FIND THE UNIT OF TEMPERATURE USED IN THE ARCHIVE ##
time_unit =  ## FIND THE UNIT OF TIME USED IN THE ARCHIVE ##
for calc in section_calculation:
    temperature.append()  ## FIND THE TEMPERATURE FOR THIS CALC ##
    time.append()  ## FIND THE TIME FOR THIS CALC ##


plt.plot(time, temperature)
plt.ylabel(temperature_unit, fontsize=12)
plt.xlabel(time_unit, fontsize=12)
plt.show()
```

???- note "Solution"

        ```python
        fig = plt.figure(figsize=(10,4))
        section_calculation = archive.run[-1].calculation  ## FIND THE SECTION CALCULATION IN THE ARCHIVE ##
        temperature = []
        time = []
        temperature_unit = section_calculation[0].temperature.units  ## FIND THE UNIT OF TEMPERATURE USED IN THE ARCHIVE ##
        time_unit = section_calculation[0].time.units  ## FIND THE UNIT OF TIME USED IN THE ARCHIVE ##
        for calc in section_calculation:
            temperature.append(calc.temperature.magnitude)  ## FIND THE TEMPERATURE FOR THIS CALC ##
            time.append(calc.time.magnitude)  ## FIND THE TIME FOR THIS CALC ##


        plt.plot(time, temperature)
        plt.ylabel(temperature_unit, fontsize=12)
        plt.xlabel(time_unit, fontsize=12)
        plt.show()
        ```

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/md_tutorial_3/Protein-Water_Structure_15_0.png" alt="temperature_trajectory" width="90%" title="Temperature Trajectory.">
    </label>
</div>


2. Take some time to search through the calculation section to see what other quantities are stored there for this simulation.

3. Now let's plot the center of mass molecular radial distribution function, averaged over the last 80% of the trajectory, as seeen in the Structural Properties card of the Overview page (red curve in plot). Fill in the missing variables assignments in the following code:

```python
fig = plt.figure(figsize=(8,4))
section_MD =  ## FIND THE MOLECULAR DYNAMICS WORKFLOW SECTION IN THE ARCHIVE ##
rdf_HEX_HEX =  ## FIND THE LAST HEX-HEX RDF STORED IN THE ARCHIVE ##
rdf_start =  ## FIND THE STARTING FRAME FOR AVERAGING FOR THIS RDF ##
rdf_end =  ## FIND THE ENDING FRAME FOR AVERAGING FOR THIS RDF ##

bins = ureg.convert(rdf_HEX_HEX.bins.magnitude, rdf_HEX_HEX.bins.units, ureg.angstrom)

plt.plot(bins, rdf_HEX_HEX.value)
plt.xlabel(ureg.angstrom, fontsize=12)
plt.ylabel('HEX-HEX rdf', fontsize=12)
plt.xlim(0.1,15.0)
plt.show()
```

???- note "Solution"

        ```python
        fig = plt.figure(figsize=(8,4))
        section_MD = archive.workflow2  ## FIND THE MOLECULAR DYNAMICS WORKFLOW SECTION IN THE ARCHIVE ##
        rdf_HEX_HEX = section_MD.results.radial_distribution_functions[0].radial_distribution_function_values[-1]  ## FIND THE LAST HEX-HEX RDF STORED IN THE ARCHIVE ##
        rdf_start = rdf_HEX_HEX.frame_start  ## FIND THE STARTING FRAME FOR AVERAGING FOR THIS RDF ##
        rdf_end = rdf_HEX_HEX.frame_end  ## FIND THE ENDING FRAME FOR AVERAGING FOR THIS RDF ##

        bins = ureg.convert(rdf_HEX_HEX.bins.magnitude, rdf_HEX_HEX.bins.units, ureg.angstrom)

        plt.plot(bins, rdf_HEX_HEX.value)
        plt.xlabel(ureg.angstrom, fontsize=12)
        plt.ylabel('HEX-HEX rdf', fontsize=12)
        plt.xlim(0.1,15.0)
        plt.show()
        ```

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/md_tutorial_3/Protein-Water_Structure_19_0.png" alt="temperature_trajectory" width="90%" title="Temperature Trajectory.">
    </label>
</div>

4. Take some time to search through the workflow2 section to see what other quantities are stored there for this simulation.

### The archive_to_universe function

We have seen above how to access quantities stored within a NOMAD archive entry using either the dictionary or NOMAD archive entry representation. This approach is sufficient for extracting singular quantities from the archive for further analysis.

However, it would also be useful to have converters to store the archive for an MD simulation in a format more convenient to perform analysis. In particular, one may want to utilize existing analysis software to perform standard calculations. We have already implemented a converter to the *MDAnalysis* format. Run the following command to convert the archive into an MDAnalysis `universe`:

```python
universe = archive_to_universe(archive)
```

Check which molecule types are present in the simulation:

```python
print('Molecule Types')
print('--------------')
for moltype in np.unique(universe.atoms.moltypes):
    print(moltype)
```

    Molecule Types
    --------------
    HEX

### Simple analysis with MDAnalysis

Let's calculate the center of mass rdf and compare with the plot stored in the archive. First define the appriate molecular groups:

```python
# Get an atom group for the Hexane molecules
AG_HEX = universe.select_atoms('moltype HEX')

# Create a "bead group" for the HEXANE molecules
BG_HEX = BeadGroup(AG_HEX, compound="fragments")

# Define parameters for the rdf calculation
min_box_dimension = np.min(universe.trajectory[0].dimensions[:3])
max_rdf_dist = min_box_dimension / 2
n_bins = 200
n_smooth = 2
n_prune = 1
```

!!! note "NOTE"

        In MDAnalysis, it is not trivial to calculate center of mass rdfs.
        The concept of bead groups comes from a known work-around.
        This class is imported from the NOMAD software.


Now run the rdf calculation using the MDAnalysis function `InterRDF`:

```python
# should take ~2 min
exclusion_block = (1, 1)  # for removing self-distance
rdf = MDA_RDF.InterRDF(
    BG_HEX, BG_HEX, range=(0, max_rdf_dist),
    exclusion_block=exclusion_block, nbins=n_bins).run(
    rdf_start, rdf_end, n_prune)
```

Smooth the rdf:

```python
rdf.results.bins = rdf.results.bins[int(n_smooth / 2):-int(n_smooth / 2)]
rdf.results.rdf = np.convolve(
    rdf.results.rdf, np.ones((n_smooth,)) / n_smooth,
    mode='same')[int(n_smooth / 2):-int(n_smooth / 2)]
```

Plot the rdf:

```python
fig = plt.figure(figsize=(8,4))
plt.plot(bins, rdf_HEX_HEX.value, label='NOMAD archive', color='k', lw=2)
plt.plot(rdf.results.bins, rdf.results.rdf, label='MDAnalysis', linestyle='--', color='r', lw=2)

plt.legend(fontsize=16)
plt.xlabel(ureg.angstrom, fontsize=12)
plt.ylabel('SOL-SOL rdf', fontsize=12)
plt.xlim(0.1, 10.)
plt.show()
```

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/md_tutorial_3/Protein-Water_Structure_28_0.png" alt="hexane_rdf" width="90%" title="Hexane RDF.">
    </label>
</div>


Using MDAnalysis, we can also easily featurize the configurations for data-driven analysis. For example, calculate the pairwise distance matrix for carbons throughout the trajectory:

```python
carbon_indices = [ind for ind, type in enumerate(universe.atoms.types) if type.startswith('C')]
selection = 'index ' + ' '.join([str(ind) for ind in carbon_indices])
carbons_group = universe.select_atoms(f'{selection}')

for i_fr, frame in enumerate(universe.trajectory):
    if i_fr == 0:
        distances = self_distance_array(carbons_group.positions, box=frame._unitcell)
    else:
        distances = np.vstack((distances, self_distance_array(carbons_group.positions, box=frame._unitcell)))
print(distances.shape)
```

    (11, 1282401)


### Visualization using NGLViewer

We can use the MDAnalysis representation along the the module `nglview` to visualize the trajectory within our notebook. First, unwrap the coordinates to make the molecules whole for visualization:

```python
AG_all = universe.select_atoms('all')
for ts in universe.trajectory:
    AG_all.unwrap(compound='fragments')
```

Now, set up the viewer with a minimal representation:
```python
view = nv.show_mdanalysis(AG_all)
view.center()
view.clear()  # clear the initial representation automatically set up by nglview
view.add_point('all')  # employ lightest rep
# adjust the widget size
view._set_size('700px', '600px')


view
```

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/md_tutorial_3/Vis_0.png" alt="hexane_rdf" width="70%" title="Hexane RDF.">
    </label>
</div>


Then, you can adjust the visualization using nglview [selection commands](https://nglviewer.org/ngl/api/manual/usage/selection-language.html):

```python
moltype = 'HEX'
view.clear()
view.add_point('all')
selection = '@' + ', '.join([str(i) for i in universe.select_atoms('molnum 0')._ix])
view.add_spacefill(selection)
```

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/md_tutorial_3/Vis_1.png" alt="hexane_rdf" width="70%" title="Hexane RDF.">
    </label>
</div>

