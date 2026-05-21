## What is Mathmetic?

<img src="https://blendertimer.com/software/screenshots/mathmetic1-larger.png" alt="Mathmetic screenshot">

Mathmetic is a powerful and completely free multi-calculator workspace designed for speed, precision, and extensive functionality when working with numbers. Built with intermediate and advanced users in mind, it combines a range of mathematical tools into a clean, efficient environment that makes complex calculations easier to organize and manage.

At the core of Mathmetic is its 6-in-1 calculator workspace, which allows multiple calculations to run side-by-side in the same window. This makes it much easier to compare formulas, test variations, or keep intermediate results visible while continuing to work, nearly eliminating the need to constantly re-enter formulas.
Mathmetic also includes an extensive collection of built-in mathematical functions covering common operations as well as a few more advanced functions. Integrated unit conversions allow values to be quickly converted between measurement systems inside the formula itself, streamlining workflows that involve physics, engineering, or real-world data.

Completely free to use (even for commercial use), Mathmetic aims to be a reliable everyday tool for students, engineers, developers, and basically anyone who regularly works with mathematics. By combining multiple calculators, powerful functions, and convenient conversions into a single workspace, the application can significantly improve both the speed and clarity of your mathematical workflow.

---

## 🚀 Latest Updates!

### New features
- **New feature: integer calculation system** - *since many large calculations don't need full decimal calculations (and decimal calculations seem to max out for multimillion digit integers), a new 'integer' calculation system has been added which can perform much larger integer calculations and can perform them faster. The calculation system can be changed in settings.*
- **New operator: double factorial (`!!`)** - *added double factorial to the list of operators.*
- **New function: `fibonacci(n)`** - *added a new function for the Fibonacci sequence.*
- **New function: `prime(n)`** - *added a new function to get the nth prime.*
- **New function: `sphere(n, a)`** - *added a new function to get the volume of a sphere.*
- **New parameter for the `d` function** - *a new optional decimal precision paramter has been given to the `d` function. This will allow the `d` function to use a higher (or lower) decimal precision value than the global decimal precision value.*
- **Speed optimization for factorial** - *changed the factorial operator to calculate using an integer-only system and binary splitting instead of the basic sequencial multiplication method for calculating factorial. Factorial calculations are now up to 2000x faster!*
- **Speed optimization for power** - *power operations are now faster, so safety limits for power operations have been raised from 1,000 to 100,000.*
- **Speed optimization for pi** - *the 'pi' constant has now been upgraded to use binary splitting and is up to 2x faster.*
- **New unit conversions:** *exabyte, zettabyte.*
- **New feature: history refresh button** - *added a small new "Refresh history" button in the history window.*
- **New feature: history sort options** - *added sorting controls (latest, oldest, fastest, slowest) to the history window.*
- **New feature: prune history** - *performing many large calculations eventually cause the entire application to lag as it had to move around millions of digits any time history was written or read. Now you can prune very large or very old history entries if the application begins to lag (fully custom age and size controls).*
- **New feature: history calculation time tooltip** - *added a tooltip to the "Calculation time" text which will show the calculation time in a more readable format (7864684.7ms -> 02:11:04.6847).*

### Bug fixes

- **Corrected factorial stacking** - *in preparation for the new double factorial opperator, the issue where the factorial operator would stack on itself (e.g. `10!!` would give the same result as `(10!)!`) was fixed. The factorial operator `!` is no longer stackable.*
- **Corrected the `d` function returning an absolute value** - *the `d` function has been modified so that it returns a non-absolute value (it can be placed inside an `abs` function if an absolute value is required).*
- **Corrected history UI loading on startup** - *history UI was loaded at startup despite it being loaded when the history window is opened. This occasionally created unnecessary lag at startup.*
- **Corrected unnecessary BigNumber cloning on each math function** - *`_mkBN()` was being used separately on nearly every math function to create a clone of `BigNumber`. This led to unnecessary lag. All functions now use the main `BigNumber` object.*

***Minor Code Changes***

- *History log delay has been decreased to 2000ms*
- *Removed unused variable in `sound` function*
- *Removed unused `_highPrecisionPow` function*
- *Added `fullnonformatted` to the calculation result (used for String -> BigInt)*
- *Overall optimization and cleanup*

---

Mathmetic is completely free FOREVER and is released under the [BT-LU license](https://blendertimer.com/licenses/bt-lu) and the [BlenderTimer Privacy Policy](https://blendertimer.com/privacy-policy).

![Static Badge](https://img.shields.io/badge/Donate-1D74FF?style=for-the-badge&link=https%3A%2F%2Fblendertimer.com%2Fdonate%3Fp%3DMathmetic)