## <center> Working with the NOMAD archive </center>

In this part of the tutorial we will demonstrate how to query data from the NOMAD repo and work with it within a python environment.

As an example, we will use a short simulation of an atomistic box of hexane molecules.

Import all the necessary modules. If you want to skip the molecular visualization, comment out nglview


```python
# conda create -n "CECAM_tutorial" python==3.9
# conda activate CECAM_tutorial
# pip install nomad-lab
# conda install nglview
# conda install "ipywidgets <8" -c conda-forge

# NOTE: you may have to restart vscode or other editor after running these updates.
```


```python
# Python
import numpy as np

# NOMAD tools
from nomad.atomutils import archive_to_universe
from nomad.atomutils import BeadGroup
from nomad.datamodel import EntryArchive
from nomad.units import ureg

# I/O
import json

# Visualization
import matplotlib.pyplot as plt
import nglview as nv
print(nv.__version__)

# MDAnalysis
import MDAnalysis.analysis.rdf as MDA_RDF
from MDAnalysis.analysis.distances import self_distance_array, distance_array

import requests
import time
```


    


    3.0.8


In general, you can use the [NOMAD API](https://nomad-lab.eu/prod/rae/docs/api.html) to grab particular archive entries from the repository or to search the repository for entries with certain attributes. This can be achieved in python using the [`requests`](https://docs.python-requests.org/en/latest/index.html) module.

To download an entire published entry, you just need to know the `entry_id` and then you can download the archive with a simple command:


```python
def measure_method(method, *args, **kwargs):
    """
    Measure the execution time of a given method with arguments.
    
    Args:
        method: The method/function to be measured.
        *args: Positional arguments to be passed to the method.
        **kwargs: Keyword arguments to be passed to the method.
    """
    start_time = time.time()
    result = method(*args, **kwargs)
    end_time = time.time()
    elapsed_time = end_time - start_time
    
    elapsed_minutes = int(elapsed_time // 60)
    elapsed_seconds = int(elapsed_time % 60)
    
    print(f"Method took {elapsed_minutes} minutes and {elapsed_seconds} seconds to execute.")
    return result
```


```python
entry_id = 'hxaepf6x12Xt2IX2jCt4DyfLG0P4'
endpoint_url = 'https://nomad-lab.eu/prod/v1/api/v1/'
```


```python
# this should take ~7 m depending on the internet connection
full_nomad_url = f'{endpoint_url}/entries/{entry_id}/archive/download'
response = measure_method(requests.get, full_nomad_url)

print(f"The status code returned is {response}")
data_all = response.json()
print(f"The message can be unpackaged via the following options {set(data_all.keys())}")
```

    Method took 6 minutes and 11 seconds to execute.
    The status code returned is <Response [200]>
    The message can be unpackaged via the following options {'results', 'processing_logs', 'workflow2', 'm_ref_archives', 'metadata', 'run'}


The resulting variable `data` is a dictionary. The keys of this dictionary directly correspond to the sections that we examined in the **DATA** tab on the entry page of NOMAD in Tutorial 1:


```python
full_nomad_url = f'{endpoint_url}/entries/{entry_id}/archive/query'
query_specification = {
    "required": {
        "run": {
            "system": {
                "atoms": "*",
                "atoms_group": "*"
            }
        }
    }
}
```


```python
response = measure_method(requests.post, full_nomad_url, json=query_specification)

print(f"The status code returned is {response}")
data_filtered = response.json()
print(f"The message can be unpackaged via the following options {set(data_filtered.keys())}")
```

    Method took 0 minutes and 7 seconds to execute.
    The status code returned is <Response [200]>
    The message can be unpackaged via the following options {'data', 'entry_id', 'required'}


Recall that the section **run** &rarr; **system**  is a list containing configurational information from each frame in the trajectory. The following code snippet extracts the positions, velocities, and box vectors from this list: 


```python
def print_dict_as_tree(d, prefix="", is_last=True):
    keys = list(d.keys())
    for i, key in enumerate(keys):
        if i == len(keys) - 1:
            new_prefix = prefix + "└─ "
        else:
            new_prefix = prefix + "├─ "
        
        value = d[key]
        type_str = f" ({type(value).__name__})"
        length_str = ""
        
        if isinstance(value, dict):
            print(new_prefix + str(key) + type_str)
            is_last_child = i == len(keys) - 1
            print_dict_as_tree(value, prefix + ("    " if is_last_child else "│   "), is_last_child)
        elif isinstance(value, list):
            has_dict = any(isinstance(item, dict) for item in value)
            if has_dict:
                print(new_prefix + str(key) + type_str)
                for item in value:
                    if isinstance(item, dict):
                        is_last_child = i == len(keys) - 1
                        print(prefix + ("    " if is_last_child else "│   ") + "├─ [")
                        print_dict_as_tree(item, prefix + ("    " if is_last_child else "│   ") + "│   ", True)
                        print(prefix + ("    " if is_last_child else "│   ") + "│   ]")
                    else:
                        is_last_child = i == len(keys) - 1
                        length_str = f" (Length: {len(value)})"
            else:
                is_last_child = i == len(keys) - 1
                length_str = f" (Length: {len(value)})"
                print(new_prefix + str(key) + type_str + length_str)
        else:
            print(new_prefix + str(key) + type_str)
        
        if length_str:
            is_last_child = i == len(keys) - 1
            print(prefix + ("    " if is_last_child else "│   ") + "├─" + length_str)
```


```python
archive_filtered = EntryArchive.m_from_dict(data_filtered)
archive_all = EntryArchive.m_from_dict(data_all)
systems = data_filtered['data']['archive']['run'][0]['system']
system = systems[0]
# print_dict_as_tree(system)
```


```python
archive_filtered['run']
```




    []




```python
n_atoms = system['atoms'].get('n_atoms')
n_frames = len(system) if system is not None else None
atom_names = system['atoms'].get('labels')

# get the atom positions, velocites, and box dimensions
positions = np.empty(shape=(n_frames, n_atoms, 3))
velocities = np.empty(shape=(n_frames, n_atoms, 3))
dimensions = np.empty(shape=(n_frames, 6))
for frame_ind, frame in enumerate(systems):
    sec_atoms_fr = frame.get('atoms')
    if sec_atoms_fr is not None:
        positions_frame = sec_atoms_fr['positions']
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


    ---------------------------------------------------------------------------

    AttributeError                            Traceback (most recent call last)

    Cell In[109], line 12
         10 sec_atoms_fr = frame.get('atoms')
         11 if sec_atoms_fr is not None:
    ---> 12     positions_frame = sec_atoms_fr.positions
         13     positions[frame_ind] = ureg.convert(positions_frame.magnitude, positions_frame.units,
         14                                         ureg.angstrom) if positions_frame is not None else None
         15     velocities_frame = sec_atoms_fr.velocities


    AttributeError: 'dict' object has no attribute 'positions'


Exercise: Fill in the missing variables assignments to make the temperature trajectory plot for this calculation. This should correspond to the one found on the overview page: ...


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


    
![png](Hexane-archive-draft_files/Hexane-archive-draft_17_0.png)
    


Take some time to search through the calculation section to see what other quantities are stored there for this simulation...

Now let's plot the water-water center of mass rdf averaged over the last 80% of the trajectory, similar to what was displayed on the overview page in Tutorial 2: 


```python
archive.workflow2.results
```




    MolecularDynamicsResults(calculation_result_ref, calculations_ref, temperature, trajectory, radial_distribution_functions)




```python
fig = plt.figure(figsize=(8,4))
section_MD = archive.workflow2  ## FIND THE MOLECULAR DYNAMICS WORKFLOW SECTION IN THE ARCHIVE ##
rdf_SOL_SOL = section_MD.results.radial_distribution_functions[0].radial_distribution_function_values[-1]  ## FIND THE LAST SOL-SOL RDF STORED IN THE ARCHIVE ##
rdf_start = rdf_SOL_SOL.frame_start  ## FIND THE STARTING FRAME FOR AVERAGING FOR THIS RDF ##
rdf_end = rdf_SOL_SOL.frame_end  ## FIND THE ENDING FRAME FOR AVERAGING FOR THIS RDF ##

bins = ureg.convert(rdf_SOL_SOL.bins.magnitude, rdf_SOL_SOL.bins.units, ureg.angstrom)  

plt.plot(bins, rdf_SOL_SOL.value)
plt.xlabel(ureg.angstrom, fontsize=12)
plt.ylabel('HEX-HEX rdf', fontsize=12)
plt.xlim(0.1,15.0)
plt.show()
```


    
![png](Hexane-archive-draft_files/Hexane-archive-draft_20_0.png)
    


Take some time to search through the workflow2 section to see what other quantities are stored there for this simulation...

It is already clear that it would be useful to develop converters to store the archive for an MD simulation in a format more convenient to perform analysis. In particular, one may want to utilize existing analysis software to perform standard calculations. We have already implemented a converter to the *MDAnalysis* format:


```python
# should take ~10 s
universe = archive_to_universe(archive)
```

Let's use this format to examine the protein simulation in more detail. First, let's check which molecule type are present:


```python
print('Molecule Types')
print('--------------')
for moltype in np.unique(universe.atoms.moltypes): 
    print(moltype)
```

    Molecule Types
    --------------
    HEX


Let's get acquainted with the *MDAnalysis* software by reproducing the water-water molecular rdf that we plotted above.


```python
# Get an atom group for the water
AG_SOL = universe.select_atoms('moltype HEX')

# Create a "bead group" for the water.
# In MDAnalysis, it is not trivial to calculate center of mass rdfs. 
# The concept of bead groups comes from a known work-around. 
# This class is imported from the NOMAD software. 
BG_SOL = BeadGroup(AG_SOL, compound="fragments")


min_box_dimension = np.min(universe.trajectory[0].dimensions[:3])
max_rdf_dist = min_box_dimension / 2
n_bins = 200
n_smooth = 2
n_prune = 1
```


```python
# should take ~2 min
exclusion_block = (1, 1)  # for removing self-distance
rdf = MDA_RDF.InterRDF(
    BG_SOL, BG_SOL, range=(0, max_rdf_dist),
    exclusion_block=exclusion_block, nbins=n_bins).run(
    rdf_start, rdf_end, n_prune)
```


```python
# smooth the rdf
rdf.results.bins = rdf.results.bins[int(n_smooth / 2):-int(n_smooth / 2)]
rdf.results.rdf = np.convolve(
    rdf.results.rdf, np.ones((n_smooth,)) / n_smooth,
    mode='same')[int(n_smooth / 2):-int(n_smooth / 2)]
```


```python
fig = plt.figure(figsize=(8,4))
plt.plot(bins, rdf_SOL_SOL.value, label='NOMAD archive', color='k', lw=2)
plt.plot(rdf.results.bins, rdf.results.rdf, label='MDAnalysis', linestyle='--', color='r', lw=2)

plt.legend(fontsize=16)
plt.xlabel(ureg.angstrom, fontsize=12)
plt.ylabel('HEX-HEX rdf', fontsize=12)
plt.xlim(0.1, 10.)
plt.show()
```


    
![png](Hexane-archive-draft_files/Hexane-archive-draft_29_0.png)
    


Using MDAnalysis, we can easily featurize the system for ML analysis


```python
carbon_indices = [ind for ind, type in enumerate(universe.atoms.types) if type.startswith('C')]
selection = 'index ' + ' '.join([str(ind) for ind in carbon_indices])
carbons_group = universe.select_atoms(f'{selection}')
```


```python
for i_fr, frame in enumerate(universe.trajectory):
    if i_fr == 0:
        distances = self_distance_array(carbons_group.positions, box=frame._unitcell)
    else:
        distances = np.vstack((distances, self_distance_array(carbons_group.positions, box=frame._unitcell)))
```


```python
distances.shape
```




    (11, 1282401)



We can visualize the system with NGLViewer


```python
import MDAnalysis as MDA
path = '/home/jfrudzinski/work/GRO_DEV/MD_Overview/Hexane/Hexane_trimmed/'
sys = 'hexane.267'
tpr_fnm = sys+'.tpr'
trr_fnm = sys+'.trr'
universe = MDA.Universe(path + tpr_fnm, path + trr_fnm)
```


```python
# select all atoms except for virtual sites associated with the water model
# should take ~15 s
AG_all = universe.select_atoms('all')
for ts in universe.trajectory:  # make the molecules whole 
    AG_all.unwrap(compound='fragments')
```


```python
# Set up the viewer
view = nv.show_mdanalysis(AG_all)
view.center()
view.clear()  # clear the initial representation automatically set up by nglview
view.add_point('all')  # employ lightest rep
# adjust the widget size
view._set_size('700px', '600px')


view
```


    NGLWidget(count=11)


You can adjust the visualization using nglview selection commands https://nglviewer.org/ngl/api/manual/usage/selection-language.html 


```python
moltype = 'HEX'  
view.clear()
view.add_point('all')
# view.add_ball_and_stick(moltype)
view.add_spacefill('atom name .C')

```


```python
moltype = 'HEX'  
view.clear()
view.add_point('all')
# view.add_ball_and_stick(moltype)
selection = '@' + ', '.join([str(i) for i in universe.select_atoms('molnum 0')._ix])
view.add_spacefill(selection)
```


```python
query_specifications = {
  "owner": "visible",
  "query": {
      "entry_id": entry_id
  },
  "aggregations": {},
  "pagination": {
    "order_by": "upload_create_time",
    "order": "desc",
    "page_size": 1
  },
  "required": {
      'include': ['results.properties.thermodynamic.trajectory.provenance.molecular_dynamics.time_step']
  }
}
```
