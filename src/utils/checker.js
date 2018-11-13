import languagetool from "languagetool-api";

export function spellCheck(language, text) {
  const params = { language, text };
  languagetool.check(params, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });
}
