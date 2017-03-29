/** @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
 * Copyright (C) 2016  Petr Hošek
 */
if (window.view === undefined) {
  var view = {};
}
if (view.sett_view === undefined) {
  view.sett_view = {};
}
$.extend(view.sett_view, {
  inited: false,
  shown: false,
  init: function () {
    this.$popup = $('<div id="settings_popup"></div>');
    this.$popup.appendTo("body");
    $.get("templates/settings_popup.html", $.proxy(this.loaded, this), "text");
    this.inited = true;
    control.settings.lang.subscribe(this, "render");
  },
  loaded: function (template) {
    if (template) {
      this.template = template;
      Mustache.parse(template);
    }
    this.render();
  },
  show: function () {
    this.shown = true;
    this.render();
  },
  render: function () {
    var rendered;
    if (this.shown) {
      if (!this.inited) this.init();
      if (!this.template) return;
      rendered = Mustache.render(this.template, {
        eneUnit: {
          label: Lang("Energy unit")
        },
        textSize: {
          label: Lang("Text size"),
          value: control.settings.textSize.get()
        },
        closeLabel: Lang("Close"),
        header: Lang("Settings")
      });
      this.$popup.show().html(rendered);
      this.bind();
    } else {
      if (this.$popup) this.$popup.hide();
    }
  },
  hide: function () {
    this.shown = false;
    this.render();
  },
  bind: function () {
    var $popup = this.$popup;
    $popup.find("#settings_popup_close").click($.proxy(this.hide, this));
    $popup.find("#energy_unit_select").change(function () {
      var value = parseInt($(this).val());
      control.settings.enunit.set(value);
    });
    $popup.find("#text_size_input").change(function () {
      control.settings.textSize.set($(this).val());
    });
  },
  notify: function (signal) {
    if (signal === "render") {
      this.render();
    }
  }
});
