var banner = "\n\
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
"                                                                      
console.log("This page is powered by:\n",banner)                                      



outputtext = document.myform.outputtext
outputtext.value = ""


default_txt = "\
import pyjs\n\
"

var editor = CodeMirror.fromTextArea(document.myform.inputtext, {
  lineNumbers: true,
  mode: 'python',
  //  add theme attribute like so:
  theme: 'monokai',
  extraKeys: {
        "Tab": function(cm) {
                cm.replaceSelection("   ", "end");
} }
});
editor.setSize(null, 600);

var logeditor = CodeMirror.fromTextArea(document.myform.outputtext, {
  lineNumbers: false,
  readOnly: true,
  //  add theme attribute like so:
  theme: 'monokai'
});
logeditor.setSize(null, 200);


const print = (text) => {

  logeditor.replaceRange(text+"\n", CodeMirror.Pos(logeditor.lastLine()))
  editor.scrollTo(CodeMirror.Pos(logeditor.lastLine()));
}
const printErr = (text) => {
  logeditor.replaceRange("ERROR: "+text+"\n", CodeMirror.Pos(logeditor.lastLine()))
}


window.onload = () => {
    var savedText = localStorage.getItem("text") || default_txt;
    editor.getDoc().setValue(savedText);
};



var Module = {};
(async function() {

  var pyjs = await createModule()
  Module = pyjs
  var promise_core = await import('./python_data.js')
  pyjs.init()

  var deps = await pyjs._wait_run_dependencies()
  interpreter =  new pyjs.Interpreter()
  main_scope = pyjs.main_scope()


  let btn2 = document.getElementById("run_button");
  btn2.onclick = function () {
    logeditor.getDoc().setValue("")
    var text = editor.getValue();
    localStorage.setItem("text", text)

    try{
        interpreter.exec(text, main_scope)
    }
    catch (e) {
      logeditor.replaceRange(JSON.stringify(e.message)+"\n", CodeMirror.Pos(logeditor.lastLine()))
    }
  };


})();