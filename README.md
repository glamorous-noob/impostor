# Impostor

## A Firefox extension to replace an HTTP response's body by a local file

![icon](.\icons\icon.png)



### The main idea

If you've ever wanted to modify the body of an HTTP response before it reaches your web browser, this extension here is one way to do it. 

### Main use case

Here's why this extension was created initially.

Let's say you want to reverse engineer a javascript file dynamic-analysis-style inside Firefox's native debugger, BUT said file is minified, obfuscated and cramped into one line only... You can't read it, you can't put breakpoints in it (because a breakpoint is bound to a line number in the browser's debugger), and that's frustrating.

Here's what you could do though:

- You locate the request URL for the particular js you're looking into
- You download said javascript, beautify it, nicify it, add your hooks, to whatever you want in it locally
- You use Impostor to make your browser load ***your modified version of this file*** whenever a request is made to it!
- Debug it in the native debugger like a boss



### Limitations

This extension is supported only by Firefox for now.

### How to install

For now, this extension is not signed and it is not available in any extension / add-on store. You can use it in Firefox though by downloading it and [adding it as a temporary extension](https://blog.mozilla.org/addons/2015/12/23/loading-temporary-add-ons/).