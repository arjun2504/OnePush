var menu = [];
(function() {
  $(function() {

    var api = "https://hackerearth.0x10.info/api/one-push?type=json&query=list_websites";
    var apiPush = "https://hackerearth.0x10.info/api/one-push?type=json&query=push&title=|TITLE|&url=|URL|&tag=|TAG|";

    var app = {
      init: function() {
        this.fetch();

        /*
        var img = $('#avatar');
        dominantColor = getDominantColor(img);
        console.log(dominantColor);
        */
      },

      ajax: function(param) {


        var opts = {
          cache: true,
          dataType:'json'
        };
        return $.ajax(api + '?' + param, opts);

        //return {"websites":[{"id":"1","title":"daniel g. siegel","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/5.png","url_address":"http:\/\/www.dgsiegel.net\/","tag":"personal"},{"id":"2","title":"Ross Penman","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/29.png","url_address":"https:\/\/rosspenman.com\/","tag":"Personal"},{"id":"3","title":"goker \/ resume","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/37.png","url_address":"http:\/\/gokercebeci.com\/me","tag":"Blog"},{"id":"4","title":"Gilles Quenot \/ SO","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/6.png","url_address":"https:\/\/goo.gl\/fdr5Kq","tag":"Social"},{"id":"5","title":"Nithin Rao Kumblekar","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/10.png","url_address":"http:\/\/www.nithinkumblekar.com\/","tag":"Caricature"},{"id":"6","title":"I am ben","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/9.png","url_address":"http:\/\/www.iamben.co.uk\/","tag":"Professional"},{"id":"7","title":"Mathias Karlsson","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/18.png","url_address":"https:\/\/bounty.github.com\/researchers\/avlidienbrunn.html","tag":"Security"},{"id":"8","title":"randomstream","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/11.png","url_address":"http:\/\/kracekumar.com\/","tag":"personal"},{"id":"9","title":"travisneilson","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/37.png","url_address":"http:\/\/travisneilson.com\/","tag":"personal"},{"id":"10","title":"adhamdannaway","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/36.png","url_address":"http:\/\/www.adhamdannaway.com\/","tag":"personal"},{"id":"31","title":"honey","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/22.png","url_address":"https:\/\/www.gurdevrana.com","tag":"personal"},{"id":"26","title":"chin2km","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/11.png","url_address":"http:\/\/www.chin2km.com","tag":"portfolio"},{"id":"30","title":"srujan","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/43.png","url_address":"http:\/\/something.com","tag":"personal"},{"id":"17","title":"ugph","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/24.png","url_address":"http:\/\/ugph.in\/","tag":"psdtohtml"},{"id":"35","title":"food","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/29.png","url_address":"http:\/\/zomato.com","tag":"fooding"},{"id":"36","title":"cryptlife","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/42.png","url_address":"http:\/\/www.cryptlife.com","tag":"tech"},{"id":"34","title":"rajat","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/7.png","url_address":"https:\/\/www.gmail.com","tag":"search"},{"id":"33","title":"test","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/44.png","url_address":"http:\/\/test.abs.com","tag":"hacktest"},{"id":"32","title":"ajay","favicon_image":"http:\/\/hackerearth.0x10.info\/api\/avatar\/3.png","url_address":"http:\/\/ugph.in\/","tag":"personal"}]};
      },

      fetch: function() {
        var self = this;
        var data = this.ajax(api);
        var temp = [];
        $.when(data).done(function(response){
          var query = location.search.split('q=')[1];
          var show = null;
          if(query !== 'undefined') {
            $('#search').val(query);
            show = true;
          }

          //response.websites = result.websites;
          //_.some(element, _.method('match',/cryptli/i));

          var sites = _.map(response.websites, function(element) {
            var domain = self.extractDomain(element.url_address);
            var likes = 0;
            if(localStorage.getItem("site-" + element.id) !== null) {
              likes = Number(localStorage.getItem("site-" + element.id));
            }
            domain = domain.replace('www.', '');
            menu.push(_.startCase(_.toLower(element.tag.toLowerCase())));
            return _.extend({}, element, { 'domain': domain, 'likes' : likes });

          });

          menu = self.unique(menu);

          sites = _(sites).reverse().value();

          sites = _.filter(sites, function(o) {
            var regex = new RegExp(query, "i");
            return _.some(o, _.method('match', regex));
          });

          console.log(menu);

          var count = sites.length;
          var final = { 'websites': sites, 'count': count};

          if(show) {
            var showall = { 'showAllBtn' : true };
            _.assign(final, showall);
          }
          else {
            var showall = { 'showAllBtn' : null };
            _.assign(final, showall);
          }

          var nav = { 'menu': menu };

          self.hbHelper(final, 'sites', 'sites-disp');
          self.hbHelper(nav, 'menu', 'menu-disp');

          $('.loading').css('display','none');
          $('.intro-disp').css('display','block !important');
        });
      },

      extractDomain: function(url) {
        var domain;
        if (url.indexOf("://") > -1) {
          domain = url.split('/')[2];
        }
        else {
          domain = url.split('/')[0];
        }
        domain = domain.split(':')[0];
        return domain;
      },

      hbHelper: function(content, identifier, placed) {
        var source = $('#' + identifier).html();
        var template = Handlebars.compile(source);
        var html = template(content);
        $('.' + placed).html(html);

        this.enableLike();
        this.enablePush();
      },

      enableLike: function() {

        $('div[id^=site-]').on('mouseover', function() {
          var outerid = $(this).data('id');
          $('.like-button-' + outerid).css('display','block').off('click').on('click', function() {
            var id = $(this).data('lid');
            if(localStorage.getItem("site-" + id) !== 'undefined') {
              var count = Number(localStorage.getItem("site-" + id)) + 1;
              localStorage.setItem("site-" + id, count);
            }
            else {
              localStorage.setItem("site-" + id, Number(1));
            }
            $('.like-box-' + id).html(" " + localStorage.getItem("site-" + id) + " ")
          });
        });

        $('div[id^=site-]').on('mouseout', function() {
          id = $(this).data('id');
          $('.like-button-' + id).css('display','none');
        });


      },

      enablePush: function() {
        var self = this;
        $('#push-new').on('click', function() {
          var title = $('#site-title').val();
          var tag = $('#site-tag').val();
          var url = $('#site-url').val();
          var old = $(this).html();
          $(this).html("Pushing...");
          $(this).attr('disabled','disabled');
          self.pushNew(title, url, tag, old);
        });
      },

      pushNew: function(title, url, tag, restore) {
        var self = this;

        apiPush.replace('|TITLE|', title);
        apiPush.replace('|URL|', url);
        apiPush.replace('|TAG|', tag);

        var sendPush = this.ajax(apiPush);

        $.when(sendPush).done(function(response) {
          $('#push-new').removeAttr('disabled');
          $('#push-new').html(restore);

          self.fetch();

          $('#msg').css('display','block');

          if(response.status == 200) {
            $('#msg').removeClass('alert-danger');
            $('#msg').addClass('alert-success');

            $('#site-title').val('');
            $('#site-tag').val('');
            $('#site-url').val('');
          }
          else {
            $('#msg').addClass('alert-danger');
            $('#msg').removeClass('alert-success');
          }

          $('#msg').html(response.message);

        });
      },


      unique: function(origArr) {
        var newArr = [],
        origLen = origArr.length,
        found,
        x, y;

        for ( x = 0; x < origLen; x++ ) {
          found = undefined;
          for ( y = 0; y < newArr.length; y++ ) {
            if ( origArr[x] === newArr[y] ) {
              found = true;
              break;
            }
          }
          if ( !found) newArr.push( origArr[x] );
        }
        return newArr;
      }

    };

    app.init();

  });
})();
