window.timing = new Map();

(function (open, send) {
    let xhrOpenRequestUrl;
    let xhrSendResponseUrl;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._method = method;
        this._url = url;
        xhrOpenRequestUrl = new URL(url, document.location.href).href;
        window.timing[xhrOpenRequestUrl] = {
            begin: new Date().valueOf(),
            method: method
          }
        return open.apply(this, arguments);
    }

    XMLHttpRequest.prototype.send = function (postData) {
        this.addEventListener('readystatechange', function() {
            if (window.timing[this.responseURL] && this.readyState === 4) {
              xhrSendResponseUrl = this.responseURL;
              const duration = new Date().valueOf() - window.timing[xhrSendResponseUrl].begin;
              const api = window.timing[xhrSendResponseUrl].method + '：' + xhrSendResponseUrl;
            //   console.log({
            //         timingVar: api,
            //         timingValue: duration,
            //       })
            const event = new CustomEvent("overtime", {detail : {
              "api": api,
              "duration": duration
            }});
               window.dispatchEvent(event);
            }
          }, false);

        return send.apply(this, arguments);
    }
})(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);

(function () {
    let fetchRequestUrl;
    let fetchResponseUrl;
    const originFetch = window.fetch;
    window.fetch = async function (...args) {
        const method = args[1].method;
        fetchRequestUrl = window.location.protocol + "//" + window.location.host + args[0];
        window.timing[fetchRequestUrl] = {
            begin: new Date().valueOf(),
            method: method
          }
        const response = await originFetch(...args);
        fetchResponseUrl = response.url;
        if (window.timing[fetchResponseUrl]) {
            const duration = new Date().valueOf() - window.timing[fetchResponseUrl].begin;
            const api = window.timing[fetchResponseUrl].method + '：' + fetchResponseUrl;
            // console.log({
            //         timingVar: api,
            //         timingValue: duration
            //     });
            const event = new CustomEvent("overtime", {detail : {
                "api": api,
                "duration": duration
            }});
            window.dispatchEvent(event);
        }
    return response;
    }   
})();