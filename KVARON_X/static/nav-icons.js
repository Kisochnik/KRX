(function () {
  var basePath = "/static/icons/panels/";
  var icons = {
    home: "home.png",
    news: "news.png",
    music: "music.png",
    gaming: "games.png",
    messages: "messages.png",
    friends: "friends.png",
    notifs: "notifications.png",
    notifications: "notifications.png",
    profile: "profile.png",
    shop: "shop.png",
    wallet: "wallet.png",
    settings: "settings.png",
    admin: "admin.png"
  };

  function loadImage(fileName, onReady) {
    var img = new Image();
    img.onload = onReady;
    img.src = basePath + fileName;
  }

  function mark(selector, className) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.classList.add(className);
    });
  }

  function applyPanelIcons() {
    Object.keys(icons).forEach(function (name) {
      loadImage(icons[name], function () {
        mark(".icon-" + name, "has-panel-icon");
      });
    });

    loadImage("krx_coin_pixel.png", function () {
      mark(".krx-coin-svg", "has-krx-coin");
    });

    var loadedCheckboxes = 0;
    ["checkbox_outline.png", "checkbox_filled.png"].forEach(function (fileName) {
      loadImage(fileName, function () {
        loadedCheckboxes += 1;
        if (loadedCheckboxes === 2) {
          document.documentElement.classList.add("has-custom-checkboxes");
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyPanelIcons);
  } else {
    applyPanelIcons();
  }
})();
