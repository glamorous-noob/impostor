# Impostor

## A Firefox extension to replace an HTTP response's body by a local file

![icon](.\icons\icon.png)

-----------

### Contents

[What it does](#what-it-does)

[Main use case](#main-use-case)

[Other use cases](#other-use-cases)

[Test environment](#test-environment)

[What it does at the moment](#what-it-does-at-the-moment)

[Current limitations](#current-limitations)

[To do:](#to-do)

[How to install](#how-to-install)

[Who designed the kickass logo](#who-designed-the-kickass-logo)

------



### What it does

If you've ever wanted to modify the body of an HTTP response before it reaches your web browser, this extension here is one way to do it. 

### Main use case

Here's why this extension was created initially.

Let's say you want to reverse engineer a javascript file dynamic-analysis-style inside Firefox's native debugger, BUT said file is minified, obfuscated and cramped into one line only... You can't read it, you can't put breakpoints in it (because a breakpoint is bound to a line number in the browser's debugger), and that's frustrating. 

Here's what you could do though:

- Locate the request URL for the particular js you're looking into
- Download said javascript, beautify it, nicify it, add your hooks, do whatever you want with it locally
- Open your devtools debugger and make sure to disable caching
- Use Impostor to make your browser load ***your modified version of this file*** whenever a request is made to it
- Reload the page that has the script
- Debug it in the native devtools debugger like a boss

### Other use cases

Correct a js bug, custom style a website with custom css, etc.

### Test environment

Firefox 73.0.1 - Windows 10

### What it does at the moment

- It provides a very crappy but functional interface to define which file replaces which [URL pattern](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns)
- It provides an interface to choose which tabs are to be monitored
- It applies defined rules to monitored tabs
- Changes are visible for the end user and in the devtools debugger. They are <u>not</u> visible in the devtools Networks Monitoring panel.

### Current limitations

This extension supports Firefox only.

It is good for textual files only.

It does not modify headers.

### To do:

- Improve UI
- Add a refresh button to refresh all URL Pattern / Impostor pairs
- Allow editing of URL Pattern/ Impostor pairs
- Allow deletion of individual URL Pattern / Impostor pairs
- Support more than just textual files (txt, html, js, css, md, etc.)
- Modify response headers if needed (content-type, content-length, etc.)
- Provide interface for user to add/overwrite response headers freely
- More stuff?

### How to install

For now, this extension is not signed and it is not available in any extension / add-on store. You can use it in Firefox though by cloning this repo and [adding it as a temporary extension](https://blog.mozilla.org/addons/2015/12/23/loading-temporary-add-ons/).

I am not sure if it's worth it to sign the extension and maintain it on the official store.

### Who designed the kickass logo

Good friend [@Khadrawi](https://github.com/Khadrawi) ♥ 