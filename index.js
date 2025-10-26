import "./src/scss/style.scss";
import { dynamicImportScriptsOnClick } from "./src/js/utils";

// desired Solutionn
dynamicImportScriptsOnClick([
  {
    triggerSelector: ".accordion",
    fileName: "Accordion",
  },
  {
    triggerSelector: ".navbar__btn-open",
    fileName: "Navbar-Offcanvas",
    className: "Navbar",
  },
  {
    triggerSelector: ".tabs",
    fileName: "Tabs",
  },
]);

// this works
// const accordionTrigger = document.querySelector(".accordion");

// if (accordionTrigger) {
//   accordionTrigger.addEventListener(
//     "click",
//     (event) => {
//       import("./src/js/components/Accordion.js")
//         .then(({ Accordion }) => {
//           console.log("clicked");

//           new Accordion();
//           event.target.dispatchEvent(
//             new MouseEvent("click", { bubbles: true })
//           );
//         })
//         .catch((e) => {
//           console.log("error: ", e);
//         });
//     },
//     { once: true }
//   );
// }

// const menuTrigger = document.querySelector(".navbar__btn-open");

// if (menuTrigger) {
//   menuTrigger.addEventListener(
//     "click",
//     (event) => {
//       import("./src/js/components/Navbar-Offcanvas")
//         .then(({ Navbar }) => {
//           console.log("clicked");

//           new Navbar();
//           event.target.dispatchEvent(
//             new MouseEvent("click", { bubbles: true })
//           );
//         })
//         .catch((e) => {
//           console.log("error: ", e);
//         });
//     },
//     { once: true }
//   );
// }

// const tabsTrigger = document.querySelector(".tabs");
// if (tabsTrigger) {
//   tabsTrigger.addEventListener(
//     "click",
//     (event) => {
//       import("./src/js/components/Tabs")
//         .then(({ Tabs }) => {
//           console.log("clicked");

//           new Tabs();
//           event.target.dispatchEvent(
//             new MouseEvent("click", { bubbles: true })
//           );
//         })
//         .catch((e) => {
//           console.log("error: ", e);
//         });
//     },
//     { once: true }
//   );
// }
