var apiMonitorAlterNum = 0;
var apiOvertime = 1000;

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      if (key === 'apiMonitorStatus') {
        if (newValue === 'true') {
            const s = document.createElement('script');
            s.src = chrome.runtime.getURL('inject.js');
            s.id = "apiMonitorInject";
            s.type = "module";
            s.onload = function() {
                this.remove();  
            };
            (document.head||document.documentElement).appendChild(s);
            chrome.storage.local.get(["apiOvertime"]).then((result) => {
                apiOvertime = result.apiOvertime; 
            });
        } else {
        location.reload();
        }
      }
    }
  });

function notifyMe(message) {
    apiMonitorAlterNum += 1;
    const description = "慢接口：" + message.api;
    const title = "总耗时：" + message.duration + "ms";  
    const alterTemplate = `
    <div class="ant-notification ant-notification-topRight" style="right: 0px; top: 24px; bottom: auto;">
        <div>
            <div class="ant-notification-notice ant-notification-notice-error ant-notification-notice-closable">
                <div class="ant-notification-notice-content">
                    <div class="ant-notification-notice-with-icon" role="alert">
                        <span role="img" aria-label="close-circle" class="anticon anticon-close-circle ant-notification-notice-icon ant-notification-notice-icon-error">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 00-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z">
                                </path>
                                <path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z">
                                </path>
                            </svg>
                        </span>
                        <div class="ant-notification-notice-message">${title}</div>
                        <div class="ant-notification-notice-description">${description}</div>
                    </div>
                </div>
                <a tabindex="0" class="ant-notification-notice-close">
                    <span class="ant-notification-notice-close-x">
                        <span role="img" aria-label="close" class="anticon anticon-close ant-notification-notice-close-icon">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                                </path>
                            </svg>
                        </span>
                    </span>
                </a>
            </div>
        </div>
    </div>
`  
    const bodyElem = document.getElementsByTagName('body')[0];
    const notificationElem = document.createElement("div");
    const elemId = `api-monitor-alter-${apiMonitorAlterNum}`;
    notificationElem.id = elemId
    notificationElem.innerHTML = alterTemplate;
    bodyElem.appendChild(notificationElem);
    const notificationCloseList = document.getElementsByClassName("ant-notification-notice-close-x");
    const notificationClose = notificationCloseList[notificationCloseList.length-1];
        notificationClose.addEventListener("click", () => {
        const nofictionElem = document.getElementById(elemId);
        nofictionElem.parentNode.removeChild(nofictionElem);
    });
  
    setTimeout(() => {
        const nofictionElem = document.getElementById(elemId);
        nofictionElem?.parentNode.removeChild(nofictionElem);  
    }, 4000);
}

window.addEventListener('overtime', function(e) {
    if (e.detail.duration > apiOvertime) {
        notifyMe({
            "duration": e.detail.duration,
            "api": e.detail.api
        });
    }   
});

window.addEventListener('load', () => {
    chrome.storage.local.get(["apiMonitorStatus"]).then((result) => {
        if (result.apiMonitorStatus === "true") {
            const s = document.createElement('script');
            s.src = chrome.runtime.getURL('inject.js');
            s.id = "apiMonitorInject";
            s.type = "module";
            s.onload = function() {
                this.remove();  
            };
            (document.head||document.documentElement).appendChild(s);
            chrome.storage.local.get(["apiOvertime"]).then((result) => {
                apiOvertime = result.apiOvertime; 
            });
        } 
    });
})



