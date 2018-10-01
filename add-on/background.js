browser.runtime.onMessage.addListener(notify);

function notify(message) {

    var sending = browser.runtime.sendNativeMessage("certiorem", null)

    // sending.then(
    //     (response) => console.log("certiorem: { response: " + response + " }"),
    //     (error) => console.log("certiorem: { response: " + error + " }"))

}
