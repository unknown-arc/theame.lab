/**
 * THEME.BY — My Course
 * Single-click sorting toggle.
 */

(function () {

    "use strict";


    /*
     * Prevent duplicate initialization.
     */

    if (window.__THEME_BY_MYCOURSE__) {
        return;
    }

    window.__THEME_BY_MYCOURSE__ = true;


    document.addEventListener(
        "click",
        function (e) {

            const sortBtn =
                e.target.closest(
                    '[data-region="sorting-choice"] .dropdown-toggle'
                );


            if (!sortBtn) {
                return;
            }


            /*
             * Stop Moodle's normal dropdown.
             */

            e.preventDefault();
            e.stopPropagation();


            const parent =
                sortBtn.closest(
                    '[data-region="sorting-choice"]'
                );


            if (!parent) {
                return;
            }


            /*
             * Find sorting options.
             */

            const menuItems =
                parent.querySelectorAll(
                    '.dropdown-item[data-filter="sort"]'
                );


            if (!menuItems.length) {
                return;
            }


            /*
             * Find the currently selected item.
             *
             * Moodle uses:
             *
             * aria-current="true"
             *
             * instead of:
             *
             * .active
             */

            const current =
                Array.from(menuItems).find(
                    item =>
                        item.getAttribute(
                            "aria-current"
                        ) === "true"
                );


            /*
             * Find the next option.
             */

            let nextOption;


            if (!current) {

                nextOption =
                    menuItems[0];

            } else {

                const currentIndex =
                    Array.from(menuItems)
                        .indexOf(current);


                const nextIndex =
                    (currentIndex + 1)
                    % menuItems.length;


                nextOption =
                    menuItems[nextIndex];

            }


            /*
             * Trigger Moodle's own sorting logic.
             */

            if (nextOption) {

                nextOption.click();

            }

        },

        true
    );


    console.log(
        "[THEME.BY] My Course filterbar initialized"
    );

})();