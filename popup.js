const button = document.getElementById("launch");
const durationRead = document.getElementById("duration-read");
const durationEdit = document.getElementById("duration-edit");

window.addEventListener('load', ()=>{
    chrome.storage.local.get(["apiMonitorStatus"]).then((result) => {
        if (result.apiMonitorStatus === "true") {
            button.innerText = "关闭API监控";
            durationEdit.style.display = 'none'
            durationRead.style.display = 'block';
            chrome.storage.local.get(["apiOvertime"]).then((result) => {
                document.getElementById("duration-time-read").innerText = result.apiOvertime;
            });
        } else {
            button.innerText = "开启API监控";
            durationEdit.style.display = 'block'
            durationRead.style.display = 'none';
            chrome.storage.local.get(["apiOvertime"]).then((result) => {
                document.getElementById("duration-time-edit").value = result.apiOvertime;
            });
        }
    });

});

button.addEventListener("click", function() {
    chrome.storage.local.get(["apiMonitorStatus"]).then((result) => {
        if (result.apiMonitorStatus === "false") {
            const errMsg = document.getElementById("duration-err");
            const overtime = document.getElementById("duration-time-edit").value;
            if (overtime === "") {
                errMsg.innerText = "必填";
            } else {
                errMsg.innerText = "";
                chrome.storage.local.set({"apiMonitorStatus": "true"}).then(() => {
                    chrome.storage.local.set({"apiOvertime": overtime}).then(() => {
                        document.getElementById("duration-time-read").innerText = overtime;
                        switchApiButton(1);        
                    })
                });
            }
        } else {
            chrome.storage.local.set({"apiMonitorStatus": "false"}).then(() => {
                switchApiButton(0);
            });
        }
    });
});

// 1: open 0: close
function switchApiButton(status) {
    if (status === 1) {
        button.innerText = "关闭API监控";
        durationEdit.style.display = 'none'
        durationRead.style.display = 'block';
    } else if (status === 0) {
        button.innerText = "开启API监控";
        durationEdit.style.display = 'block'
        durationRead.style.display = 'none';
        chrome.storage.local.get(["apiOvertime"]).then((result) => {
            document.getElementById("duration-time-edit").value = result.apiOvertime;
        });
    }
}