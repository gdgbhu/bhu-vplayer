(function () {
    'use strict';
    Polymer({
      ready: function(){
        this.$.newSearchField.style.display = 'none';
        this.$.loader.style.display = 'none';
      },
      showSearchField: function(){
        this.$.newSearchField.style.display = 'block';
      },
      clientId: '<CLIENT_ID From Developer Console>',
      login: false,
      logout: true,
      rpathCount: false,
      playlistdata: [],
      subscriptiondata: [],
      videoData: [],
      profiledata: {},
      username: '',
      useremail: '',
      userimageurl: '',
      singlevideodata: {},
      isVideoLiked: false,
      isVideoDisliked: false,
      status: {},
      searchVideo : function(){
        if(this.newVideoSearchValue){
          this.searchVideosLists(this.newVideoSearchValue);
          // Reset Input field status
          this.$.newSearchField.style.display = 'none';
          this.$.newSearchField.value = null;
        }
      },
      signIn: function(response){
        this.login = true;
        this.logout = false;
        this.status = response;
        // Find an elegant way of doing this
        this.username = this.first_word(response.detail.user.G.getName());
        this.useremail = response.detail.user.G.getEmail();
        this.userimageurl = response.detail.user.G.getImageUrl();
        // console.log(response.detail.user);
        this.getPlayLists();
        this.getSubscriptionLists();
        this.getPopularVideosLists();
        var svId = MoreRouting.getRoute('vplayer');
        this.loadedVideo(svId.parts[1]);
        this.$.searchbtn.style.display = 'block';
      },
      signOut: function(response){
        this.login = false;
        this.logout = true;
        console.log(response);
        this.status = response;
        this.$.searchbtn.style.display = 'none';
      },
      logoutUser: function(){
        // Logout the User
        this.status.detail.user.disconnect();
        this.login = false;
        this.logout = true;
        MoreRouting.navigateTo('vlist');
        this.$.loader.style.display = 'none';
      },
      getPlayLists: function(){
        gapi.client.load('youtube','v3',function(){
          var yt = gapi.client.youtube;
          var playlistRequest = yt.playlists.list({
            mine: true,
            part: "snippet"
          });
          playlistRequest.execute(function(res){
            if(res.items){
              this.playlistdata = res.items;
              // console.log(this.playlistdata);
            }
          }.bind(this));
        }.bind(this));
      },
      getSubscriptionLists: function(){
        gapi.client.load('youtube','v3',function(){
          var yt = gapi.client.youtube;
          var subscriptionRequest = yt.subscriptions.list({
            mine: true,
            part: "snippet"
          });
          subscriptionRequest.execute(function(res){
            if(res.items){
              this.subscriptiondata = res.items;
              // console.log(this.subscriptiondata);
            }
          }.bind(this));
        }.bind(this));
      },
      getPopularVideosLists: function(){
        this.$.loader.style.display = 'block';
        gapi.client.load('youtube','v3',function(){
          var yt = gapi.client.youtube;
          var popularVideoRequest = yt.videos.list({
            chart: "mostPopular",
            part: "snippet",
            regionCode: "ng"
          });
          popularVideoRequest.execute(function(res){
            if(res.items){
              this.videoData = res.items;
              this.$.loader.style.display = 'none';
              // console.log(this.videoData);
            }
          }.bind(this));
        }.bind(this));
      },
      searchVideosLists: function(searchTerm){
        // Navigate to home page
        MoreRouting.navigateTo('vlist');
        this.$.loader.style.display = 'block';
        gapi.client.load('youtube','v3',function(){
          var yt = gapi.client.youtube;
          var searchVideoRequest = yt.search.list({
            part: "snippet",
            maxResults: 20,
            safeSearch: "strict",
            type: "video",
            q: searchTerm
          });
          searchVideoRequest.execute(function(res){
            if(res.items){
              // Update values of popular videos
              this.videoData = res.items;
              this.$.loader.style.display = 'none';
              // console.log(this.videoData);
            }
          }.bind(this));
        }.bind(this));
      },
      loadVideoById: function(e, detail, target){
        var videoId;
        if(this.isObjectVal(target.templateInstance.model.video.id)){
          videoId = target.templateInstance.model.video.id.videoId;
        } else {
          videoId = target.templateInstance.model.video.id;
        }
        this.$.demoscroll.scroller.scrollTop = 0;
        
        gapi.client.load('youtube','v3',function(){
            var yt = gapi.client.youtube;
            var singleVideoRequest = yt.videos.list({
              id: videoId,
              part: "snippet,player,statistics"
            });
            this.$.loader.style.display = 'block';
            singleVideoRequest.execute(function(res){
              if(res.items){
                this.singlevideodata = res.items[0];
                this.$.demoscroll.scroller.scrollTop = 0;
                this.$.loader.style.display = 'none';
                // console.log(this.singlevideodata);
              }
            }.bind(this));
          }.bind(this));
        e.stopPropagation();
      },
      loadedVideo: function(singleId){
        this.$.loader.style.display = 'block';
        var pt = MoreRouting.getRoute('vplayer');
        var videoId = singleId;
        if(pt.parts.length > 0){
            gapi.client.load('youtube','v3',function(){
            var yt = gapi.client.youtube;
            var singleVideoRequest = yt.videos.list({
              id: videoId,
              part: "snippet,player,statistics"
            });
            singleVideoRequest.execute(function(res){
              if(res.items){
                this.singlevideodata = res.items[0];
                this.$.loader.style.display = 'none';
                // console.log(this.singlevideodata);
              }
            }.bind(this));
          }.bind(this));
          this.rpathCount = true;
        } else {
          this.rpathCount = false;
        }
      },
      likeVideo: function(){
        var lk;
        var pt = MoreRouting.getRoute('vplayer');
        var vidId = pt.parts[1];
        // console.log(vidId);
        if(this.isVideoLiked){
          lk = 'like';
          this.isVideoLiked = false;
        } else {
          lk = 'none';
          this.isVideoLiked = true;
        }
        gapi.client.load('youtube','v3',function(){
            var yt = gapi.client.youtube;
            var lkRequest = yt.videos.rate({
              id: vidId,
              rating: lk
            });
            lkRequest.execute(function(res){
              // console.log(res);
            });
          });
      },
      dislikeVideo: function(){
        var dlk;
        var dlkVidId;
        var pt = MoreRouting.getRoute('vplayer');
        dlkVidId = pt.parts[1];
        // console.log(dlkVidId);
        if(this.isVideoDisliked){
          dlk = 'dislike';
          this.isVideoDisliked = false;
        } else {
          dlk = 'none';
          this.isVideoDisliked = true;
        }
        gapi.client.load('youtube','v3',function(){
            var yt = gapi.client.youtube;
            var dlkRequest = yt.videos.rate({
              id: dlkVidId,
              rating: lk
            });
            dlkRequest.execute();
          });
      },
      // CUSTOM FILTERS
      isObjectVal: function(val){
        if (val === null) { return false;}
        return ( (typeof val === 'function') || (typeof val === 'object') );
      },
      isStringVal: function(val){
        if (typeof val == 'string' || val instanceof String){
          return true;
        } else {
          return false;
        }
      },
      trim_words: function(strW){
        return strW.split(/\s+/,20).join(" ") + "...";
      },
      first_word: function(str){
        return str.split(' ')[0];
      },
      shortenLargeNumber: function(num, digits){
        var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'], decimal;
        for(var i=units.length - 1; i >= 0; i--) {
            decimal = Math.pow(1000, i+1);
            if(num <= -decimal || num >= decimal) {
                return +(num / decimal).toFixed(digits) + units[i];
            }
        }
        return num;
      },
    });

  })();