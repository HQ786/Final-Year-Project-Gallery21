"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/detect-element-overflow";
exports.ids = ["vendor-chunks/detect-element-overflow"];
exports.modules = {

/***/ "(ssr)/./node_modules/detect-element-overflow/dist/esm/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/detect-element-overflow/dist/esm/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ detectElementOverflow)\n/* harmony export */ });\nfunction getRect(element) {\n    return element.getBoundingClientRect();\n}\nfunction detectElementOverflow(element, container) {\n    return {\n        get collidedTop() {\n            return getRect(element).top < getRect(container).top;\n        },\n        get collidedBottom() {\n            return getRect(element).bottom > getRect(container).bottom;\n        },\n        get collidedLeft() {\n            return getRect(element).left < getRect(container).left;\n        },\n        get collidedRight() {\n            return getRect(element).right > getRect(container).right;\n        },\n        get overflowTop() {\n            return getRect(container).top - getRect(element).top;\n        },\n        get overflowBottom() {\n            return getRect(element).bottom - getRect(container).bottom;\n        },\n        get overflowLeft() {\n            return getRect(container).left - getRect(element).left;\n        },\n        get overflowRight() {\n            return getRect(element).right - getRect(container).right;\n        },\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZGV0ZWN0LWVsZW1lbnQtb3ZlcmZsb3cvZGlzdC9lc20vaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2dhbGxlcnkyMS13ZWItYXBwLTIuMC8uL25vZGVfbW9kdWxlcy9kZXRlY3QtZWxlbWVudC1vdmVyZmxvdy9kaXN0L2VzbS9pbmRleC5qcz8xYjE1Il0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGdldFJlY3QoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGV0ZWN0RWxlbWVudE92ZXJmbG93KGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGdldCBjb2xsaWRlZFRvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSZWN0KGVsZW1lbnQpLnRvcCA8IGdldFJlY3QoY29udGFpbmVyKS50b3A7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb2xsaWRlZEJvdHRvbSgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSZWN0KGVsZW1lbnQpLmJvdHRvbSA+IGdldFJlY3QoY29udGFpbmVyKS5ib3R0b207XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb2xsaWRlZExlZnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0UmVjdChlbGVtZW50KS5sZWZ0IDwgZ2V0UmVjdChjb250YWluZXIpLmxlZnQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb2xsaWRlZFJpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJlY3QoZWxlbWVudCkucmlnaHQgPiBnZXRSZWN0KGNvbnRhaW5lcikucmlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBvdmVyZmxvd1RvcCgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSZWN0KGNvbnRhaW5lcikudG9wIC0gZ2V0UmVjdChlbGVtZW50KS50b3A7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBvdmVyZmxvd0JvdHRvbSgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSZWN0KGVsZW1lbnQpLmJvdHRvbSAtIGdldFJlY3QoY29udGFpbmVyKS5ib3R0b207XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBvdmVyZmxvd0xlZnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0UmVjdChjb250YWluZXIpLmxlZnQgLSBnZXRSZWN0KGVsZW1lbnQpLmxlZnQ7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBvdmVyZmxvd1JpZ2h0KCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJlY3QoZWxlbWVudCkucmlnaHQgLSBnZXRSZWN0KGNvbnRhaW5lcikucmlnaHQ7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/detect-element-overflow/dist/esm/index.js\n");

/***/ })

};
;