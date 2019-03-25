# Portsmouth Degree Calculator

## todo

* [x] version control
* [x] desktop view
* [x] github
* [ ] calculate rules
  * [x] rule a = (Mean of Year 2 * 0.4) + (Mean of Year 3 * 0.6)  
  * [x] rule b = (Mean of Year 3)
  * [x] rule c = (Median grade of year 2 and year 3)
* [ ] validation
* [ ] saving
* [ ] offline
  * [ ] Icons
  * [ ] Code (a cacheing "Service Worker")

## maybe
* [ ] Simplify page (and maintenance) with HTML5 templates
* [ ] "send a link" feature with pre-filled numbers
* [ ] Include the full text of each rule later in the page, linked from where the rule preductions are shown.
* [ ] GPA Predictor
  * GPA grade conversions after rounding are as follows [from, to, GP]
        ```JSON
        [
            [ 75, 100, 4.25 ],
            [ 71, 74, 4.00 ],
            [ 67, 70, 3.75 ],
            [ 64, 66, 3.50 ],
            [ 61, 63, 3.25 ],
            [ 57, 60, 3.00 ],
            [ 54, 56, 2.75 ],
            [ 50, 53, 2.50 ],
            [ 48, 48, 2.25 ],
            [ 43, 47, 2.00 ],
            [ 40, 42, 1.50 ],
            [ 38, 38, 1.00 ],
            [ 35, 37, 0.75 ],
            [ 30, 34, 0.50 ],
            [ 0, 28 0.00 ]
        ]
