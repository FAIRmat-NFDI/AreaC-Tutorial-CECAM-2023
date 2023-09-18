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

### Scenario 1 - Example setup

!!! assignment
    **You want to learn how to set up a Molecular Dynamics simulation in _Gromacs_ and need an example.
    Your system of interest is _water_, which can be quite tricky to model.
    You want to compare results from several setups to find the one most suitable to you.**

    In this exercise, you will learn:

    - How to toggle and combine filters.
    - How to work with dynamic statistics.
    - How to reset the search.

In the _entries table_ NOMAD is already listing all database _entries_.
The strategy is to **narrow or _filter_ this list down** to our needs.
Our main tool here, will be the _search menu_ (left-hand side).
Take stock of its structure.
There is a list of _filter groups_ or themes.
Subgroups are indented below their main group.
Any filter group with an arrow (`>`) can be clicked open to reveal various filters and statistics.
To close the side pane and reveal the full table again, use the arrow back (`<-`) or simply click anywhere outside of it.

Now, **scroll down to check out the full list**. What main groups are there?
Remember, we essentially want to learn more about Gromacs and its calculation setup.
**Under which filter groups do you think we could find them?**

While it is somewhat hidden, you can find the "Program Name" under "Method".
It comes with a text bar and a list of suggestions.
You can try extending the list further and further, but Gromacs is not the most represented code in our database.
Here, it is probably faster to just type out its name.
Take a look back at the **side menu**, where you will find the **applied filter listed as _chips_**.

!!! tip
    Almost all text bars in NOMAD support **autocomplete**.
    This comes in handy when you are unsure of the spelling or capitalization.
    Start with the first few letters and select your choice by clicking or hitting `<enter>`.

Notice how the overview list changes with respect to your filter!
Yet, the list of remaining calculations is still quite long (3.496 matches)... 
Most likely, there will not be a single filter that solves our problem completely.
That is alright, though, we can just **stack up several filters**.

!!! tip
    You can toggle the **statistics** scale via the dropdown menu right to the name.
    Conversely, if the statistics are ever the browser down, deactivate them by deselecting "Filters" > "options menu" (`⋮`) > "Show advanced statistics".

Which subsequent filter to search for first depends on your priorities: do you want to learn mostly about running Molecular Dynamics or how a forcefield for water should be tweaked?
Let us go with former.
Fortunately, there already is a **filter subgroup called "Molecular Dynamics", so click it open**.
You are now presented with several settings.
Judging from the statistics, we have the best chance with a setting that covers the widest range of calculations (28.000 entries).
**Select "Temperature" under "Available Properties"**. <!-- @Joseph: do you want me to to add a "Molecular Dynamics" selection button?-->

!!! tip
    If you have trouble **understanding any term**, just hover over it with the mouse.
    A summary text will appear.
    For example, "Molecular Dynamics" > "Available Properties" clarifies that we are dealing observables documented along the trajectory.

System specifications are found under "Material".
Since we know the composition of our system, **click on "Elements / Formula"** and **select the matching elements** in the periodic table.
The number of database entries containing the other elements too is communicated via the color code.
Those that are already **filtered out will be gray**, just as you saw when opening the side pane.
This is the filter stacking mentioned before, showing that Gromacs users typically work on organic systems.
You can see both chips on the left.
Note how there is an "and" in between.
While **filters** between side menu options stack, those **within a side pane each have their own logic**.
We are looking for pure water, so O and H suffice. <!-- Shame how we don't have a subgroup search yet -->
**Remove all data with additional elements** by selecting "only compositions that exclusively contain these atoms".

!!! success
    You are left with 2 MD calculations in the entries overview.
    Clicking on either, will fold out a quick summary.
    **Clicking on the arrow** (`->`) will bring you to an _Overview page_.
    More on that in [Part II](part2.md).
    By **clicking through on "FILES"**, you will get an overview of the uploaded files.
    These for sure contain output, but often also input.
    Both could serve as great starting points for deploying your own calculations.

Actually, the **exact historical order** in which we applied the filters **does not matter**.
I.e. the same set of filters will yield the same search result.
This insight comes with a small caveat: the statistics that we see as we are stacking up our filters will behave differently.
These filters are like small questions or details that we use construct an overall query.
If we take a **different route**, we will see **different intermediate results** and this could lead us to **change our final formulation**.

To see this effect in action, rewind back to where we were choosing our priorities and let us go with the latter instead.
Just **click the cross (`x`) at the top of the filter menu**, and **reapply the filters** for Gromacs and the composition.
Just with these settings, the entries list is so short, that we could **check the specific calculations** even **by hand**!

!!! success
    Glossing over the remaining 6 results, you discover that Sebastian Baugmart has 2 other MD simulations which were not classified as such. <!-- @Joseph is this a bug? -->
    We also find 2 more Geometry Optimizations of both systems.
    While these do not exactly match our initial objective, they could still provide us with valuable insights.
    They also inform us of the overarching workflow used by both authors, i.e. first relax the system, then run MD under various constraints. <!-- @Joseph: thermostats? -->

### Scenario 2 - Data science

!!! assignment
    **You want to train a machine-learned model and need data.
    Specifically, you are interested in predicting the HOMO-LUMO energy gap for molecules with XXXX.**

    _Note:_ this scenario assumes that you at least skimmed scenario 1.
    If anything is unclear, please take a look there first.

Similar to scenario 1, we can go about formulating this query in various ways.
Since the observable of our model is the most specifically formulated, we start by filtering for all entries that have a **HOMO-LUMO gap**.
You may have noticed the **filter group "Properties"** on your first scroll through the side menu.
Under here you can find the results extracted from the entries.
Typically, these will also be what a supervised machine-learned attempts to predict.
**Go through the filter subgroups**, looking for our observable.

!!! tip
    **What are entries exactly?**
    Entries are individually stored data packages, shown as a row in the overview table.
    In our context, they most overlap with an _individual calculation_, be they single-point or with updates to the atomic coordinates.
    When separate calculations are linked together into a _workflow_ (see [Part II](part2.md)), the overall link also receives its own dedicated entry.
    Lastly, since NOMAD covers the whole of condensed matter, entries can also be _experimental samples_ or _batches_.

!!! success
    The HOMO and LUMO are the energy levels of very specific orbitals in the electronic structure of a molecule.
    Hence, the **"Electronic" filter subgroup** best matches that theme.
    The way this side pane is layed out, it first gives you an overview of what is out there and below hands you filters for narrowing the properties further down.
    Finding the HOMO-LUMO gap is a bit tricky, since it is not named as such.
    Given that NOMAD is materials-centric (while still allowing molecular systems), it deals in condensed matter nomenclature. <!-- @Joseph: I could change the terminology here to "Band gap / HOMO - LUMO". That would mke it more accessible to other communities as well. -->
    In materials, the **"band gap"** would be the equivalent term.
    It suffices to select just that filter.
    There is no need to narrow it down, since the distinction "direct" vs "indirect" does not apply to molecules, and we are fine with the energy range as they come.

- Search by property
- Search by composition
- Search by method / functional
- Fine-tune search

### Scenario 3 - Finding context

!!! assignment
    **You are looking for a benchmark publication on XXXX.
    A colleague told you there is a good recent one by XXXX.**

- Search by author's name
- Scan by data set name
- Adjust time
- Go to publication

<!--
### Scenario 4

You found a data set of interest on XXXX. but it does not contain the observables you want.
-->

## Glossary
