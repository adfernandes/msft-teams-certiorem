console.log("certiorem: { state: loading }");

// https://developer.mozilla.org/en-US/docs/Web/API/notification
// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
// https://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/
//
// https://wiki.mozilla.org/WebExtensions/Native_Messaging
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_manifests#Manifest_location
// https://github.com/mdn/webextensions-examples/tree/master/native-messaging

var certiorem = certiorem || (function() {

    function v4uuid() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,
            c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
    }

    function clone_string(string) {
        return ('>' + string).slice(1); // https://stackoverflow.com/a/31733628
    }

    var tag = v4uuid();

    var title_then = clone_string(window.document.title);

    var title_re = /^\((\d+)\)/; // titles must match to start notifications

    var check_interval = null; // identifier for the document-title-check interval

    return {

        get_tag: function() {
            return clone_string(tag);
        },

        check_document_title: function() {

            var title_now = clone_string(window.document.title);

            var title_unchanged = (title_now === title_then);
            var no_unread_messages = !(title_re.test(title_now));

            if (no_unread_messages) {
                title_then = title_now;
                return;
            }

            if (title_unchanged) return;

            title_then = title_now;

            console.log("certiorem: { new: message }")

            var sending = browser.runtime.sendMessage(title_now);

            // sending.then(
            //     (response) => console.log("certiorem: { response: " + response + " }"),
            //     (error) => console.log("certiorem: { response: " + error + " }"))

        }

    };

})();

Notification.requestPermission().then(function(permission) {

    console.log("certiorem: { permission: " + permission + ", tag: " + certiorem.get_tag() + " }");

    certiorem.check_interval = certiorem.check_interval || setInterval(certiorem.check_document_title, 787);

    console.log("certiorem: { check_interval: " + certiorem.check_interval + " }");

});

console.log("certiorem: { state: loaded }");
