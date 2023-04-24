var banner =
  "\n\
  ______ __  __  _____  _____ _____  _____ _____ _______ ______ _   _     \n\
 |  ____|  \\/  |/ ____|/ ____|  __ \\|_   _|  __ \\__   __|  ____| \\ | |\n\
 | |__  | \\  / | (___ | |    | |__) | | | | |__) | | |  | |__  |  \\| |  \n\
 |  __| | |\\/| |\\___ \\| |    |  _  /  | | |  ___/  | |  |  __| | . ` | \n\
 | |____| |  | |____) | |____| | \\ \\ _| |_| |      | |  | |____| |\\  | \n\
 |______|_|  |_|_____/_\\_____|_|_ \\_\\_____|_|___   |_|  |______|_| \\_|\n\
              |  ____/ __ \\|  __ \\ / ____|  ____|                       \n\
              | |__ | |  | | |__) | |  __| |__                            \n\
              |  __|| |  | |  _  /| | |_ |  __|                           \n\
              | |   | |__| | | \\ \\| |__| | |____                        \n\
              |_|    \\____/|_|  \\_\\\\_____|______|                     \n\
";
console.log("This page is powered by:\n", banner);

outputtext = document.myform.outputtext;
outputtext.value = "";

default_txt =
  "\
import pyjs\n\
import numpy\n\
\n\
arr = numpy.random.rand(4,5)\n\
print(arr)\n\
";

var editor = CodeMirror.fromTextArea(document.myform.inputtext, {
  lineNumbers: true,
  mode: "python",
  //  add theme attribute like so:
  theme: "monokai",
  extraKeys: {
    Tab: function (cm) {
      cm.replaceSelection("   ", "end");
    },
  },
});
editor.setSize(null, 600);

var logeditor = CodeMirror.fromTextArea(document.myform.outputtext, {
  lineNumbers: false,
  readOnly: true,
  //  add theme attribute like so:
  theme: "monokai",
});
logeditor.setSize(null, 200);

function addToOutput(txt) {
  logeditor.replaceRange(txt + "\n", CodeMirror.Pos(logeditor.lastLine()));
  logeditor.scrollTo(CodeMirror.Pos(logeditor.lastLine()));
  var info = logeditor.getScrollInfo();
  logeditor.scrollTo(info.left, info.top + info.height);
}

const print = (text) => {
  addToOutput(text);
};
const printErr = (text) => {
  // these can be ignored
  if (
    !text.startWith("Could not find platform dependent libraries") &&
    !text.startWith("Consider setting $PYTHONHOME")
  ) {
    addToOutput("ERROR: " + text);
  }
};

window.onload = () => {
  var savedText = localStorage.getItem("text") || default_txt;
  editor.getDoc().setValue(savedText);
};

function setStatus(txt) {
  if (txt.startsWith("Downloading data... (")) {
    var numbers = [];
    txt.replace(/(\d[\d\.]*)/g, function (x) {
      var n = Number(x);
      if (x == n) {
        numbers.push(x);
      }
    });
    var str = `Downloading data: ${numbers[0]} / ${numbers[1]}`;
    addToOutput(str);
  }
}

async function make_pyjs(print, error) {
  var pyjs = await createModule({ print: print, error: print });

  await pyjs.bootstrap_from_empack_packed_environment(
    `./empack_env_meta.json` /* packages_json_url */,
    "." /* package_tarballs_root_url */,
    false /* verbose */
  );

  globalThis.pyjs = pyjs;
  return pyjs;
}

globalThis.make_pyjs = make_pyjs;


var Module = {};
(async function () {
  addToOutput("CreateModule...");
  var pyjs = await createModule({ print: print, printErr: printErr });
  Module = pyjs;
  pyjs.setStatus = setStatus;
  addToOutput("Download data ...");
  var pyjs = await make_pyjs(print, print);
  await pyjs.init();

  addToOutput("...done");
  main_scope = pyjs.main_scope();

  let btn = document.getElementById("run_button");
  btn.disabled = false;

  btn.onclick = function () {
    logeditor.getDoc().setValue("");
    var text = editor.getValue();
    localStorage.setItem("text", text);

    try {
      pyjs.exec(text, main_scope);
    } catch (e) {
      logeditor.replaceRange(
        JSON.stringify(e.message) + "\n",
        CodeMirror.Pos(logeditor.lastLine())
      );
    }
  };
})();
