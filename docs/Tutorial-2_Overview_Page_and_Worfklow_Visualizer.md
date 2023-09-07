## <center> **Tutorial 2: Molecular dynamics overview page and workflow visualizer** </center>

TODO - start this section with finding a member of a dataset in NOMAD (we could even do this is part 1 and then come back to a saved tab)


In this tutorial, we will examine the GUI features for molecular dynamics simulations in NOMAD, using as an example a simulation workflow of setting up and equilibrating a binary liquid mixture. For convenience, the simulation data has been pre-parsed and is provided in the NOMAD *Metainfo* format.

In the current directory (`Tutorial-2_MD_Overview_Page_and_Workflow_Visualizer/`), you will find the file `data/binary_mixture_pre-parsed.zip`. Upload the file to [NOMAD](https://nomad-lab.eu/), as demonstrated in Tutorial 1. In the upload page, you should see 6 identified main files: `workflow_archive.json`, &nbsp; `minimEQ1_archive.json`, &nbsp; `EQ1_archive.json`, &nbsp; `EQ2_archive.json`, &nbsp; `EQ3_archive.json`, and &nbsp; `PD1_archive.json`. &nbsp; `workflow_archive.json` corresponds to a workflow entry that describes how the other main files are related to each other. Click on the 3 dots to the right of this workflow entry. You should see a workflow graph:

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/md_tutorial_2/workflow_graph.png" alt="Uploads page" width="90%" title="Uploads page.">
    </label>
</div>

The inputs and outputs of the workflow are depicted with light blue circles. Clicking on the text label above these circles will take you to the *Metainfo* section within the **DATA** tab of the corresponding entry. The dark blue circles represent sub-workflows within this workflow. Here we have a linear workflow consisting of a geometry optimization (i.e., energy minimization), followed by 4 molecular dynamics simulations. Because only a single configuration was saved from the energy minimization (i.e., the final configuration), this configuration by default acts as the input for the entire workflow, and is also the input for the first molecular dynamics simulation.

Scroll down to the bottom of the page, where you will see references to each entry within the workflow. Click on the 3 dots next to the &nbsp; `minimEQ1_archive.json` entry. This will take you to the **OVERVIEW** page of the energy minimization step of the workflow.

At the top of this page is the **Material** section, which provides an overview of the system, including a visualizer (activated by clicking *YES* on the prompt, as in Tutorial 1). To the left of the visualizer, there is an *accordion menu* displaying the molecular topology. By default, the entire system is selected. By selecting one of the molecule groups (**GROUP_MOL** or **GROUP_MON** in this case), the visualizer will display only molecules of the selected type and make all other molecules transparent. Beneath each molecule group is a representative molecule tab, which will display a single molecule of that type in the visualizer when clicked.

Now scroll down to the **Geometry optimization** section. This energy minimization run is automatically labeled as a *geometry optimization* workflow, and the energy convergence plot is displayed in the overview page if the relevant data is available.

Scroll down to the **Workflow Graph** section. Here an automatically generated workflow graph is displayed for this entry only. Notice the *Workflow parameters* input and the *Workflow results* output. Take a few minutes to examine these sections in the *Metainfo* by clicking their text labels.

At the bottom of the page, there is an **Entry References** section, which links you to the overall workflow that we examined at the beginning of the tutorial. Click on the 3 dots next to this entry to return to the global workflow page for this upload.

Let's now examine the first molecular dynamics run of this workflow. Click on the *Molecular Dynamics* text label above the first dark blue circle with this label. This will take you to the corresponding overview page. The **Material** section is identical to the energy minimization entry, since all entries in this upload correspond to simulations of the same system.

Scroll down to the **Thermodynamic properties** section. Here we find plots of the time trajectories of various thermodynamic quantities: temperature, pressure, and potential energy in this case. At the bottom of the section some basic information about the molecular dynamics run are displayed: the timestep and the thermodynamic ensemble. We can see immediately that this *NVT* simulation was run at ~1000 K and at a very low pressure (gas phase, in line with what we observed in the visualizer).

Scroll down to the **Structural properties** section. Once a molecular dynamics workflow is detected, the NOMAD software automatically tries to calculate radial distribution functions (rdfs) as a function of the molecular center of mass for each unique pair of molecule types. These rdfs are determined for various intervals of the trajectory, as a zeroth order measure of equilibration. As expected for the gas phase, the rdfs converge quite quickly here.

Scroll down to the **Dynamical properties** section. Similar to the rdfs, NOMAD also calculated the molecular mean squared displacements for each molecule type. (Note that this requires at least 50 time frames present in the trajectory). A simple linear fitting procedure over the entire resulting msd curve is performed to determine the diffusion constant (displayed in the legend along with the corresponding *Pearson correlation coefficient*).

Again, subsequent sections display the workflow graph for this entry and the reference to the global workflow for this upload. Now go back to the global workflow overview page. Take some time to examine the overview pages for the remainder of the molecular dynamics runs within the overall workflow for this upload, and answer the corresponding questions below.

### <u> **Exercises** </u>

Provide a description of the molecular dynamics run (for example, which ensemble? what temperature? is the system equilibrated? what phase is the system in?) for:

1. the second molecular dynamics run within this workflow

2. the third molecular dynamics run within this workflow

3. the fourth molecular dynamics run within this workflow

