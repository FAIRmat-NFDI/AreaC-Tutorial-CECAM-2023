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

## <u> **Exercises** </u>

Try filtering the entries according to the following instructions:

1. Find all entries related to water, via a search by chemical formula ("Material > Elements/Formula > Chemical Formula"). How many entries do you find?
    a. Add a histogram of the `upload_create_time` using the widget buttons directly under the search bar. **TODO - this is not the best demonstration cause these were all added in the same time frame.**

2. Use the search bar to filter by `program_name`. (The proper quantity is `results.method.simulation.program_name`, but this should be suggested to you as soon as you start to type `program` into the search bar).
    a. How many entries from GROMACS and LAMMPS are there?
    b. How many of these entries are related to a molecular dynamics workflow?

3. (CHALLENGE) Find any datasets of molecular dynamics simulations.
    a. **TODO - I wish we could make an interesting scatter plot here**

Let's jump into the [NOMAD page](https://nomad-lab.eu/prod/v1/staging/gui/search/entries?upload_create_time[gte]=1419895487748&upload_create_time[lte]=1694679900000).
Take a look at the layout.
Some elements immediately stand out:

- In the middle, there is a whole list with tabulated data.
- Just above it is a search bar with the text "Type your query or keyword here".
- On the left-hand side is a _filters menu_.
- At the very top is a header with several options (left-hand side), login and units (right-hand).
Apparently, the page we have in front of us is called _Entries_.

Now, let's run through some _scenarios_ that you, as a researcher, might encounter.

### Scenario 1

You want to learn how to set up a Molecular Dynamics simulation in _Gromacs_ and need an example.
Your system of interest is _water_, which can be quite tricky to model.
You want to compare results from several setups to find the one most suitable to you.

In the _entries table_ NOMAD is already listing all database _entries_.
The strategy is to **narrow or _filter_ this list down** to our needs.
Our main tool here, will be the _search menu_ (left-hand side).
Take stock of its structure.
There is a list of _filter groups_ or themes.
Subgroups are indented below their main group.
Any filter group with an arrow (`>`) can be clicked open to reveal various filters and statistics.
To close the side pane and reveal the full table again, use the arrow back (`<-`) or simply click anywhere outside of it.

Now, **scroll down to check out the full list**. What main groups are there?
Remember we essentially want to learn more about Gromacs and its calculation setup.
**Under which filter groups do you think we could find them?**

While it is somewhat hidden, you can find the _Program Name_ under _Method_.
It comes with a text bar and a list of suggestions.
You can try extending the list further and further, but Gromacs is not the most represented code in our database.
Here, it is probably faster to just type out the name.
**Start with g r**, and NOMAD will attempt to autocomplete.
This is really handy when you are unsure of the spelling or capitalization.
**Select the relevant suggestion.**

Notice how the overview list changes with respect to your filter!
Still, the list of remaining calculations is still quite lone (3.496 matches)... 
Most likely, there will not be a single filter that solves our problem completely.
That is alright, though, we can just **stack up several filters**.

Which subsequent filter to search for first depends on your priorities: do you want to learn mostly about running Molecular Dynamics or how a forcefield for water should be tweaked?

The exact order here does not matter (you can try this out for yourself).

### Scenario 2

You want to train a machine-learned model and need data.
Specifically, you are interested in the HOMO-LUMO gap for molecules with XXXX.

- Search by property
- Search by composition
- Search by method / functional
- Fine-tune search

### Scenario 3

You are looking for a benchmark publication on XXXX.
A colleague told you there is a good recent one by XXXX.

- Search by author's name
- Scan by data set name
- Adjust time
- Go to publication

<!--
### Scenario 4

You found a data set of interest on XXXX. but it does not contain the observables you want.
-->
