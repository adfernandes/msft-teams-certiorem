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

    var last_unread_count = 0;

    var title_re = /^\((\d+)\)/; // the titlebar 'number of unread notifications'

    var check_interval = null; // identifier for the document-title-check interval

    return {

        get_tag: function() {
            return clone_string(tag);
        },

        check_document_title: function() {

            var title = clone_string(window.document.title);
            var unread_match = title.match(title_re);

            var unread_count = 0;
            if (unread_match) unread_count = parseInt(unread_match[1])

            var unread_messages = unread_count > last_unread_count;
            last_unread_count = unread_count;

            if (!unread_messages) return;

            console.log("certiorem: { new: message }")

            var sending = browser.runtime.sendMessage(unread_count);

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
