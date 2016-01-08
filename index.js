const SayCmd = require(process.cwd() + '/src/js/renderer/SayCmd');
const Timekeeper = require(process.cwd() + '/src/js/renderer/Timekeeper');

document.getElementById("run").addEventListener("click", function() {
  document.getElementById("alert").innerHTML = "";

  var params = {
    speakerName:  document.getElementById("speakerName").value,
    limitMinutes: document.getElementById("limitMinutes").value
  }
  var tk = new Timekeeper(params);

  if (tk.isValid()) {
    SayCmd.spawnSync(tk.message("start"));
    function repetition() {
      var timeoutlId = setTimeout(repetition, 1000);
      document.getElementById("currentSeconds").innerHTML = tk.currentSeconds + " seconds left";
      if (tk.currentSeconds !== tk.limitSeconds) {
        if (tk.currentSeconds % 60 === 0) {
          tk.leftMinutes--;
        }
        if (tk.currentSeconds === 60) {
          SayCmd.spawn(tk.message("progress"));
        }
        if (tk.currentSeconds < 1) {
          SayCmd.spawn(tk.message("finish"));
          clearTimeout(timeoutlId);
        }
      }
      tk.currentSeconds--;
    }
    repetition();
  } else {
    document.getElementById("alert").innerHTML = "Fill fields!";
  }
});

var activate = function() {
  var elements =  document.querySelectorAll(".list-group-item");
  for(var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function() {
      for(var j = 0; j < elements.length; j++) {
        elements[j].classList.remove("active");
      }
      this.classList.add("active");
      document.getElementById("speakerName").value = this.querySelector('.speaker-name').innerText;
      document.getElementById("limitMinutes").value = this.querySelector('.limit-minutes').innerText;
    });
  }
};
activate();

document.getElementById("speakerName").addEventListener("keyup", function() {
  const liSpeakerName = document.querySelector(".active .speaker-name");
  if (liSpeakerName.innerText != this.value) {
    liSpeakerName.innerText = this.value;
  }
});

document.getElementById("limitMinutes").addEventListener("keyup", function() {
  const pLimitMinutes = document.querySelector(".active .limit-minutes");
  if (pLimitMinutes.innerText != this.value) {
    pLimitMinutes.innerText = this.value;
  }
});

document.getElementById("add-button").addEventListener("click", function() {
  var cloneList = document.querySelectorAll(".list-group-item")[0].cloneNode(true);
  cloneList.classList.remove("active");
  cloneList.querySelector(".speaker-name").innerText = "";
  cloneList.querySelector(".limit-minutes").innerText = "";
  document.getElementById("addable-list-group").appendChild(cloneList);
  activate();
});
