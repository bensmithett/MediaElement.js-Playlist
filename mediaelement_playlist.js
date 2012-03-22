/*global $: false, jQuery: false, document: false, window: false, MediaElement: false*/

/*  
    To initialise:
        mediaElementPlaylist({
            soundSelector: ".some-class",
            audioElemID: "audio-element",
            usePlayer: false,
            playerButtonSelector: ".player-button"
        });

        soundSelector: the CSS class on all sounds in the playlist
        audioElemID: the ID you want to give the generated <audio> element
        usePlayer: [boolean] use a central player (requires all sounds to have a data-playin="playerID" attribute)
        playerButtonSelector: the CSS selector on all central player buttons
*/

var mediaElementPlaylist;

(function ($) {
    var initSound,
        initPlayer,
        handleClicks,
        handlePlayerClicks,
        playifyLink,
        pausifyLink;

    initSound = function (settings) {
        var mediaElement;

        mediaElement = new MediaElement(settings.audioElemID, {
            enablePluginDebug: true,
            pluginPath: "/plugins/",
            success: function (mediaElement, audioElem) {
                handleClicks(mediaElement, settings);

                if (settings.usePlayer) {
                    handlePlayerClicks(mediaElement, settings);
                    $(settings.playerButtonSelector).each(initPlayer);
                }
            }
        });

        $(mediaElement).on({
            ended: function () {
                playifyLink($(".playing"));
            }
        });
    };

    initPlayer = function (settings) {
        var $this = $(this),
            firstSound = $("[data-playin='" + $this.parent().attr("id") + "']").first().attr("href");

        $this.attr("href", firstSound);
    };

    handleClicks = function (mediaElement, settings) {
        $(settings.soundSelector).on("click", function (e) {
            var $this = $(this),
                soundLink = $this.attr("href"),
                currentSound = mediaElement.src,
                $playerToUse;

            e.preventDefault();

            if (settings.usePlayer && $this.data("playin")) {
                $playerToUse = $("#" + $this.data("playin") + " a");
            }

            if (soundLink === currentSound) {
                if (mediaElement.paused || mediaElement.ended) {
                    mediaElement.play();
                    pausifyLink($this);

                    if ($playerToUse) { 
                        pausifyLink($playerToUse); 
                    }
                } else {
                    mediaElement.pause();
                    playifyLink($this);

                    if ($playerToUse) { 
                        playifyLink($playerToUse); 
                    }
                }
            } else {
                mediaElement.pause();
                playifyLink($(".playing"));

                mediaElement.setSrc(soundLink);
                mediaElement.play();
                pausifyLink($this);

                if ($playerToUse) { 
                    pausifyLink($playerToUse);
                    $playerToUse.attr("href", soundLink);
                }
            }            
        });
    };

    handlePlayerClicks = function (mediaElement, settings) {
        if (settings.usePlayer) {
            $(settings.playerButtonSelector).on("click", function (e) {
                var $this = $(this),
                    soundLink = $this.attr("href"),
                    currentSound = mediaElement.src,
                    $attachedButtons;

                e.preventDefault();

                if (soundLink === currentSound) {
                    $attachedButtons = $(settings.soundSelector + "[href='" + soundLink + "']");

                    if (mediaElement.paused || mediaElement.ended) {
                        mediaElement.play();
                        pausifyLink($this);
                        pausifyLink($attachedButtons);
                    } else {
                        mediaElement.pause();
                        playifyLink($this);
                        playifyLink($attachedButtons);
                    }
                } else {
                    mediaElement.pause();
                    playifyLink($(".playing"));

                    mediaElement.setSrc(soundLink);
                    $attachedButtons = $(settings.soundSelector + "[href='" + soundLink + "']");

                    mediaElement.play();
                    pausifyLink($this);
                    pausifyLink($attachedButtons);
               }
            });
        }
    };

    playifyLink = function ($link) {
        $link.removeClass("playing");
        $link.html("Play");
    };

    pausifyLink = function ($link) {
        $link.addClass("playing");
        $link.html("Pause");
    };

    mediaElementPlaylist = function (settings) {
        var firstSound = $(settings.soundSelector).first().attr("href"),
            audioElem = document.createElement("audio");
        
        audioElem.setAttribute("src", firstSound);
        audioElem.setAttribute("id", settings.audioElemID);

        document.body.appendChild(audioElem);

        initSound(settings);
    };
}(jQuery));
