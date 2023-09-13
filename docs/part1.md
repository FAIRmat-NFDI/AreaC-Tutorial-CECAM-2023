# Part I: Overview of the NOMAD Archive and Repository.

We start the tutorial with a brief overview of the NOMAD Archive and Repository (in short, NOMAD-lab) A more general tutorial can be found in the [FAIRmat tutorial 1](https://www.fairmat-nfdi.eu/events/fairmat-tutorial-1/tutorial-1-home).


## Exploring NOMAD {#entries_section}

Go to the [NOMAD-lab website](https://nomad-lab.eu/nomad-lab/).

There are 2 main versions when exploring NOMAD-lab: 1. the [stable version](https://nomad-lab.eu/prod/v1/gui/search/entries) ("Open NOMAD" button at the top-right corner of the page), and 2. the [Beta version](https://nomad-lab.eu/prod/v1/staging/gui/search/entries) (`Beta/staging` link at the bottom-right of the page, or via `Solutions > NOMAD` in the top menu and then scrolling down).

<p align="center">
    <img src="../assets/part1_explore/beta1.png" alt="Finding the Beta in the website, option 1" width="45%" title="NOMAD Beta at the bottom of the website.">
    <img src="../assets/part1_explore/beta2.png" alt="Finding the Beta in the website, option 2" width="41.5%" title="NOMAD Beta inside Solutions > NOMAD.">
</p>

We recommend using the Beta version, since the NOMAD infrastructure is constantly being updated.

The landing NOMAD Entries page is a very intuitive and easy-to-use Graphical User Interface (GUI). Here you can explore data according to your preferences by clicking on the filter menus on the left. You can then select a variety of quantities that characterize the Material or system under study, the methodology parameters followed in the calculation or experiment, and the output properties.

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="../assets/part1_explore/explore.png" alt="Explore GUI page" width="90%" title="Exploring entries GUI page.">
    </label>
</div>
<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="../assets/part1_explore/materials.png" alt="Materials menu" width="90%" title="Materials filter menu.">
    </label>
</div>

<!-- There is a large variety of options to filter data in NOMAD. In this tutorial, you will learn about data for electronic-structure calculations, i.e., data obtained when solving Density Functional Theory (`DFT`), `GW` approximation, Bethe-Salpeter equation (`BSE`), projected tight-binding models (`Projection`), and Dynamical Mean-Field Theory (`DMFT`), as well as in the Properties menu called "Electronic". All of these menus contain (meta)information important for these calculations. If you feel some important quantity is missing, or maybe you want to extend to other electronic-structure techniques, please contact us! -->

### <u> **Exercises** </u>

Try filtering the entries according to the following instructions:

1. Find all entries related to water, via a search by chemical formula ("Material > Elements/Formula > Chemical Formula"). How many entries do you find?
    a. Add a histogram of the `upload_create_time` using the widget buttons directly under the search bar. **TODO - this is not the best demonstration cause these were all added in the same time frame.**

2. Use the search bar to filter by `program_name`. (The proper quantity is `results.method.simulation.program_name`, but this should be suggested to you as soon as you start to type `program` into the search bar).
    a. How many entries from GROMACS and LAMMPS are there?
    b. How many of these entries are related to a molecular dynamics workflow?

3. (CHALLENGE) Find any datasets of molecular dynamics simulations.
    a. **TODO - I wish we could make an interesting scatter plot here**

**TODO - @ndaelman-hu, please add some good examples/exercises here having to do with filtering**