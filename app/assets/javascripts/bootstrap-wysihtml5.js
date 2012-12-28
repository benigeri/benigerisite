!function($, wysi) {
  "use strict"

  var templates = {
    "font-styles":
      "<li class='dropdown'>" +
        "<a class='miniButton dropdown-toggle' data-toggle='dropdown' href='#'>"
          + "<span class='current-font'>Normal text</span>"
          + "<span class='entypo'>&#59236</span>"
        + "</a>"
        + "<ul class='dropdown-menu'>"
            + "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='div' class='dropdownItem'>Normal text</a></li>"
              + "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h1' class='dropdownItem'>Heading 1</a></li>"
              + "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h2' class='dropdownItem'>Heading 2</a></li>"
        + "</ul>"
      + "</li>",

    "emphasis":
      "<li>"
        + "<a class='miniButton' data-wysihtml5-command='bold' title='CTRL+B'>B</a>"
      + "</li>"
      + "<li>"
        + "<a class='miniButton' data-wysihtml5-command='italic' title='CTRL+I'>I</a>"
      + "</li>",

    "lists":  
      "<li>"
        + "<a class='miniButton' data-wysihtml5-command='insertUnorderedList' title='Unordered List'>Ul</a>"
      + "</li>"
      + "<li>"
        + "<a class='miniButton' data-wysihtml5-command='insertOrderedList' title='Ordered List'>Ol</a>"
      + "</li>"
      + "<li>"
        + "<a class='miniButton' data-wysihtml5-command='Outdent' title='Outdent'>Untab</a>"
      + "</li>"
      + "<li>"
        + "<a class='miniButton' data-wysihtml5-command='Indent' title='Indent'>Tab</a>"
      + "</li>",

    "linkPopup":
      "<div id='linkPopup' class='avgrund-popup'>"
        + "<div class='bootstrap-wysihtml5-insert-link-modal'>"
          + "<div class='popupHeader'>"
            + "<h3>Insert Link</h3>"
          + "</div>"
          + "<div class='popupInput'>"
            + "<input type='text' value='http://' class='bootstrap-wysihtml5-insert-link-url'>"
          + "</div>"
          + "<div class='popupButtonContainer'>"
            + "<a href='#' class='popupButton miniButton close'>Close</a>"
            + "<a href='#' class='popupButton miniButton insert'>Insert link</a>"
          + "</div>"
        + "</div>"
      + "</div>",

    "linkButton":
      "<li>"
        + "<a class='miniButton' data-wysihtml5-command='createLink' id='createLinkButton' title='Link'>Link</a>"
      +"</li>",

    "imagePopup":
      "<div id='imagePopup' class='avgrund-popup'>"
        + "<div class='bootstrap-wysihtml5-insert-image-modal'>"
          + "<div class='popupHeader'>"
            + "<h3>Insert Image</h3>"
          + "</div>"
          + "<div class='popupInput'>"
            + "<input type='text' value='http://' class='bootstrap-wysihtml5-insert-image-url'>"
          + "</div>"
          + "<div class='popupButtonContainer'>"
            + "<a href='#' class='popupButton miniButton close'>Cancel</a>"
            + "<a href='#' class='popupButton miniButton insert'>Insert image</a>"
          + "</div>"
        + "</div>"
      + "</div>",

    "imageButton":
          "<li>"
            + "<a class='miniButton' data-wysihtml5-command='insertImage' title='Insert image'>Image</a>"
          + "</li>",

    "html":
      "<li>"
        + "<div class='btn-group'>"
          + "<a class='miniButton' data-wysihtml5-action='change_view' title='Edit HTML'>HTML</a>"
        + "</div>"
      + "</li>"
  };

  var defaultOptions = {
    "font-styles": false,
    "emphasis": true,
    "lists": true,
    "html": true,
    "linkButton": true,
    "linkPopup": true,
    "imageButton": true,
    "imagePopup": true,
    events: {},
    parserRules: {
      tags: {
        "b":  {},
        "i":  {},
        "br": {},
        "ol": {},
        "ul": {},
        "li": {},
        "h1": {},
        "h2": {},
        "u": 1,
        "img": {
          "check_attributes": {
                  "width": "numbers",
                  "alt": "alt",
                  "src": "url",
                  "height": "numbers"
              }
        },
        "a":  {
          set_attributes: {
            target: "_blank",
            rel:    "nofollow"
          },
          check_attributes: {
            href:   "url" // important to avoid XSS
          }
        }
      }
    }
  };

  var Wysihtml5 = function(el, options) {
    this.el = el;
    this.toolbar = this.createToolbar(el, options || defaultOptions);
    this.editor =  this.createEditor(options);

    window.editor = this.editor;

      $('iframe.wysihtml5-sandbox').each(function(i, el){
      $(el.contentWindow).off('focus.wysihtml5').on({
        'focus.wysihtml5' : function(){
           $('li.dropdown').removeClass('open');
         }
      });
    });
  };

  Wysihtml5.prototype = {
    constructor: Wysihtml5,

    createEditor: function(options) {
      var parserRules = defaultOptions.parserRules;

      if(options && options.parserRules) {
        parserRules = options.parserRules;
      }

      var editor = new wysi.Editor(this.el.attr('id'), {
          toolbar: this.toolbar.attr('id'),
        parserRules: parserRules
        });

        if(options && options.events) {
        for(var eventName in options.events) {
          editor.on(eventName, options.events[eventName]);
        }
      }

        return editor;
    },

    createToolbar: function(el, options) {
      var self = this;
      var toolbar = $("<ul/>", {
        'id' : el.attr('id') + "-wysihtml5-toolbar",
        'class' : "wysihtml5-toolbar toolbar",
        'style': "display:none"
      });

      for(var key in defaultOptions) {
        var value = false;

        if(options[key] != undefined) {
          if(options[key] == true) {
            value = true;
          }
        } else {
          value = defaultOptions[key];
        }

        if(value == true) {
          console.log(key);
          if(key == "linkPopup") {
            var el = $(templates[key]).filter('#linkPopup').get(0);
            $('#avgrundStuffHolder').prepend(el);
            this.initInsertLinkPopup(el);

          }
          if(key == "imagePopup") {
            var el = $(templates[key]).filter('#imagePopup').get(0);
            $('#avgrundStuffHolder').prepend(el);
            this.initInsertImagePopup(el);
          }

          toolbar.append(templates[key]);

          if(key == "html") {
            this.initHtml(toolbar);
          }

          if(key == "linkButton") {
            this.initInsertLinkButton(toolbar);
          }

          if(key == "imageButton") {
            this.initInsertImageButton(toolbar);
          }
        }
      }

      var self = this;

      toolbar.find("a[data-wysihtml5-command='formatBlock']").click(function(e) {
        var el = $(e.srcElement);
        self.toolbar.find('.current-font').text(el.html())
      });

      this.el.before(toolbar);

      return toolbar;
    },

    initHtml: function(toolbar) {
      var changeViewSelector = "a[data-wysihtml5-action='change_view']";
      toolbar.find(changeViewSelector).click(function(e) {
        toolbar.find('a.btn').not(changeViewSelector).toggleClass('disabled');
      });
    },

    initInsertImageButton: function(toolbar) {
      toolbar.find('a[data-wysihtml5-command=insertImage]').click(
          function() {
          openDialog('#imagePopup');
        });
    },

    initInsertImagePopup: function(el) {
      var self = this;
      var insertImageModal = $(el).find('.bootstrap-wysihtml5-insert-image-modal');
      var urlInput = insertImageModal.find('.bootstrap-wysihtml5-insert-image-url');
      var insertButton = insertImageModal.find('a.insert');
      var closeButton = insertImageModal.find('a.close');
      var initialValue = urlInput.val();

      var insertImage = function() {
        var url = urlInput.val();
        urlInput.val(initialValue);
        self.editor.composer.commands.exec("insertImage", url);
        closeDialog();
      };

      urlInput.keypress(function(e) {
        if(e.which == 13) {
          insertImage();
          insertImageModal.modal('hide');
        }
      });

      insertButton.click(insertImage);
      closeButton.click(closeDialog);
    },

    initInsertLinkButton: function(toolbar) {
      toolbar.find('a[data-wysihtml5-command=createLink]').click(
          function() {
            openDialog('#linkPopup');
        });
    },

    initInsertLinkPopup: function(el) {
      var self = this;
      console.log(self);
      var insertLinkModal = $(el).find('.bootstrap-wysihtml5-insert-link-modal');
      var urlInput = insertLinkModal.find('.bootstrap-wysihtml5-insert-link-url');
      var insertButton = insertLinkModal.find('a.insert');
      var closeButton = insertLinkModal.find('a.close');
      var initialValue = urlInput.val();
      console.log(initialValue);

      var insertLink = function() {
        var url = urlInput.val();
        urlInput.val(initialValue);
        self.editor.composer.commands.exec("createLink", {
          href: url,
          target: "_blank",
          rel: "nofollow"
        });
        closeDialog();
      };
      var pressedEnter = false;

      urlInput.keypress(function(e) {
        if(e.which == 13) {
          insertLink();
          insertLinkModal.modal('hide');
        }
      });

      insertButton.click(insertLink);
      closeButton.click(closeDialog);
    }
  };

  $.fn.wysihtml5 = function (options) {
    return this.each(function () {
      var $this = $(this);
          $this.data('wysihtml5', new Wysihtml5($this, options));
      })
    };

    $.fn.wysihtml5.Constructor = Wysihtml5;

}(window.jQuery, window.wysihtml5);

