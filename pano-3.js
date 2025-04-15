function clickOpenTooltip() {
    let div = this.div;
    let innerDiv = $(div).find('.hs-inner-wrap');
    let pano = $(div).closest('.panorama')
    let currentIndex = $(div).attr('index');
    let totalHotSpots = $(pano).find('.custom-hotspot').length

    if ($(div).hasClass('active') && !$(div).hasClass('isCurrentHotspot')) {
        $(div).closest('.panorama').find('.custom-hotspot').each(function () {
            $(this).removeClass('active')
            $(this).find('.hs-inner-wrap').removeClass('active')
            $(div).closest('.panorama').find('.vo-content').text('')
        })
    } else {
        $(div).closest('.panorama').find('.custom-hotspot').each(function () {
            $(this).removeClass('active')
            $(this).find('.hs-inner-wrap').removeClass('active')
            $(div).closest('.panorama').find('.vo-content').text('')
        })
        $(div).addClass('active')
        $(innerDiv).addClass('active')
        $(div).closest('.panorama').find('.vo-content').text($(div).attr('aria-label'))
        $(div).closest('.panorama').find('.vo-content').attr('tabindex', 0)
        $(div).closest('.panorama').find('.vo-content').focus();
        $(div).closest('.panorama').find('.vo-content').append('<button></button>');
        $(div).closest('.panorama').find('.vo-content button').click();
        $(div).removeClass('isCurrentHotspot')
    }

    $(div).addClass('visited')

    let totalViewed = $(pano).find('.visited').length;

    checkPrevButton(currentIndex, totalHotSpots, pano);
    updateCount(totalViewed, totalHotSpots, pano);

    // scroll position - chrome
    let windowOffset = window.pageYOffset;

    // get then set scroll position so there is no jumping
    let scrollPos = document.documentElement.scrollTop || document.body.scrollTop
    if(scrollPos == 0){
        document.documentElement.scrollTop = document.body.scrollTop = windowOffset
    } else {        
        document.documentElement.scrollTop = document.body.scrollTop = scrollPos
    }

}

function clickOpenModal() {
    let div = this.div;
    let pano = $(div).closest('.panorama')
    let currentIndex = $(div).attr('index');
    let totalHotSpots = $(pano).find('.custom-hotspot').length;

    let closeWord = $(pano).find('.close-text').text();
    let closeButton = `<button class='close-modal' aria-label='` + closeWord + `'>X</button>"`

    let aria = this.div.ariaLabel;
    $(div).closest('.panorama').find('.vo-content').text(aria)
    $(div).closest('.panorama').find('.vo-content').attr('tabindex', 0)
    $(div).closest('.panorama').find('.vo-content').focus();
    
    dialogOpen = false;
    console.log(this)
    // create the overlay, append to body
    let overlay = $(this.div).find('.hs-inner-wrap').clone()
    $(closeButton).prependTo(overlay);
    $(overlay).appendTo(pano);
    $(overlay).wrap('<div class="pano-modal active" aria-role="dialog" tabindex=0></div>')

    $(pano).find('.ctrl.fullscreen').attr("aria-hidden", true);
    $(pano).find('.ctrl.fullscreen').attr('disabled', true); 
    $(pano).find('.ctrl.zoom-in').attr('disabled', true); 
    $(pano).find('.ctrl.zoom-out').attr('disabled', true); 
    $(pano).find('.custom-hotspot').attr("aria-hidden", true); 

    $(pano).find('.ctrl.zoom-in .zoom-in-enabled').addClass('hidden'); 
    $(pano).find('.ctrl.zoom-out .zoom-out-enabled').addClass('hidden'); 
    $(pano).find('.ctrl.zoom-in .zoom-in-disabled').removeClass('hidden'); 
    $(pano).find('.ctrl.zoom-out .zoom-out-disabled').removeClass('hidden'); 

    $(div).addClass('visited')

    let totalViewed = $(pano).find('.visited').length;

    checkPrevButton(currentIndex, totalHotSpots, pano);
    updateCount(totalViewed, totalHotSpots, pano);

    // scroll position - chrome
    let windowOffset = window.pageYOffset;

    // get then set scroll position so there is no jumping
    let scrollPos = document.documentElement.scrollTop || document.body.scrollTop
    if(scrollPos == 0){
        document.documentElement.scrollTop = document.body.scrollTop = windowOffset
    } else {        
        document.documentElement.scrollTop = document.body.scrollTop = scrollPos
    }

}

$(document).on('click', '.close-modal', function() { 

    $(this).closest('.panorama').find('.ctrl.fullscreen').attr("aria-hidden", false);
    $(this).closest('.panorama').find('.ctrl.fullscreen').attr('disabled', false); 
    $(this).closest('.panorama').find('.ctrl.zoom-in').attr('disabled', false); 
    $(this).closest('.panorama').find('.ctrl.zoom-out').attr('disabled', false); 
    $(this).closest('.panorama').find('.custom-hotspot').attr("aria-hidden", false); 

    $(this).closest('.panorama').find('.ctrl.zoom-in .zoom-in-enabled').removeClass('hidden'); 
    $(this).closest('.panorama').find('.ctrl.zoom-out .zoom-out-enabled').removeClass('hidden'); 
    $(this).closest('.panorama').find('.ctrl.zoom-in .zoom-in-disabled').addClass('hidden'); 
    $(this).closest('.panorama').find('.ctrl.zoom-out .zoom-out-disabled').addClass('hidden'); 

    $(this).closest('.panorama').find('.vo-content').focus();
    $(this).closest('.pano-modal.active').remove();
    // closeOverlay();
    // scroll position - chrome
    let windowOffset = window.pageYOffset;

    // get then set scroll position so there is no jumping
    let scrollPos = document.documentElement.scrollTop || document.body.scrollTop
    if(scrollPos == 0){
        document.documentElement.scrollTop = document.body.scrollTop = windowOffset
    } else {        
        document.documentElement.scrollTop = document.body.scrollTop = scrollPos
    }
});

let panoCount = 1;

// Hot spot creation function
function hotspot(hotSpotDiv, args) {
    hotSpotDiv.classList.add('custom-tooltip');
    var innerDiv = document.createElement('div');
    innerDiv.innerHTML = args[0];
    $(innerDiv).addClass('hs-inner-wrap');
    $(hotSpotDiv).addClass(args[5]);
    hotSpotDiv.appendChild(innerDiv);

    // $(innerDiv).find('img').css('width', $(innerDiv).width() * 5 + 'px')
    // $(innerDiv).find('img').css('width', $(innerDiv).width() + 'px')

    if(args[5] == 'pano-hs-image') {
        $(hotSpotDiv).attr({
            'role': 'button',
            'aria-label': args[2] + args[1],
            'index': args[4]
        })
    } else if (args[5] == 'pano-hs-text') {
        $(hotSpotDiv).attr({
            'role': 'button',
            'aria-label': args[2] + args[0] + args[1],
            'index': args[4]
        })
        innerDiv.style.width = $(innerDiv).width() + 'px';


        innerDiv.style.marginLeft = -($(innerDiv).width() - hotSpotDiv.offsetWidth) / 2 + 'px';
        innerDiv.style.marginTop = -$(innerDiv).height() - 12 + 'px';
    }
    $(hotSpotDiv).addClass(args[3])
}

function updateCount(totalViewed, totalIndex, pano){
    $(pano).find('.hotspot-count').text(totalViewed);
    $(pano).find('.total-hotspot').text(totalIndex);
}

function checkPrevButton(currentIndex, totalIndex, pano){

    let prevButton = $(pano).find('.previoushotspot');

    if(currentIndex > 1) {
        $(prevButton).attr('disabled', false)
        $(prevButton).find('.back-disabled').addClass('hidden')
        $(prevButton).find('.back-enabled').removeClass('hidden')
    } else {
        $(prevButton).attr('disabled', true)
        $(prevButton).find('.back-disabled').removeClass('hidden')
        $(prevButton).find('.back-enabled').addClass('hidden')
    }

    let totalViewed = $(pano).find('.visited').length;

    if(totalViewed == totalIndex){
        $(prevButton).attr('disabled', false)
        $(prevButton).find('.back-disabled').addClass('hidden')
        $(prevButton).find('.back-enabled').removeClass('hidden')
        $(pano).find('.green-check').removeClass('hidden')
    }
    updateCount(totalViewed, totalIndex, pano)
}

$(document).ready(function () {
    let currentPano;

    let viewers = [];

    $('.panorama').each(function () {
        currentPano = 'panorama' + panoCount;
        let hotspots = $(this).find('.pano-hotspots .hs-content');
        let hotspotsObj = [];

        let totalHotspots = hotspots.length;
        let of = $(this).find('.of-text').text();
        let item = $(this).find('.item-text').text();

        let image = $(this).find('.pano-image img').attr('src');

        for (var i = 0; i < hotspots.length; i++) {
            let pitch = $(hotspots[i]).attr('data-pitch')
            let yaw = $(hotspots[i]).attr('data-yaw')
            let createTooltipArgs = $(hotspots[i]).html();
            let hotspotLabel = $(hotspots[i]).attr('aria-label') + ', ';
            let hotspotStyle = $(hotspots[i]).attr('data-style');
            let contentType = $(hotspots[i]).attr('data-type');
            let voCount = ', ' + item + ' ' + (i + 1) + ' ' + of + ' ' + totalHotspots;

            if(contentType == 'pano-hs-text') {
                var newData = {
                    "pitch": pitch,
                    "yaw": yaw,
                    "cssClass": "custom-hotspot",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": [createTooltipArgs, voCount, hotspotLabel, hotspotStyle, (i+1), contentType],
                    "clickHandlerFunc": clickOpenTooltip
                };
            } else if (contentType == 'pano-hs-image') {
                var newData = {
                    "pitch": pitch,
                    "yaw": yaw,
                    "cssClass": "custom-hotspot",
                    "createTooltipFunc": hotspot,
                    "createTooltipArgs": [createTooltipArgs, voCount, hotspotLabel, hotspotStyle, (i+1), contentType],
                    "clickHandlerFunc": clickOpenModal
                };
            }
            hotspotsObj.push(newData);
        }

        let newViewer = pannellum.viewer(currentPano, {
            "type": "equirectangular",
            "panorama": image,
            "autoLoad": true,
            "showControls": false,
            // "hotSpotDebug": true,
            "keyboardZoom": false,
            "mouseZoom": false,
            "hotSpots": hotspotsObj
        })

        viewers.push(newViewer);

        panoCount++;

    })

    $('.panorama').each(function () {
        $(this).attr('tabindex', 0)

        let pano = this;
        setTimeout(function () {

            let totalHotSpots = $(pano).find('.pnlm-render-container .custom-hotspot').length;
            
            $(pano).find('.pnlm-render-container .custom-hotspot').each(function () {
                if($(this).attr('index') == 1) {
                    $(this).addClass('isNextHotspot')
                }

                if($(this).attr('index') == totalHotSpots) {
                    $(this).addClass('isPrevHotspot')
                }
                
            })

            updateCount(0, totalHotSpots, pano);

        }, 500) 
    })

    $(document).on('click touch', '.zoom-in', function (e) {
        let panoIndex = $(this).closest('.panorama').attr('index');
        panoIndex = parseInt(panoIndex) - 1;

        let newZoom = viewers[panoIndex].getHfov() - 10;
        
        viewers[panoIndex].setHfov(viewers[panoIndex].getHfov() - 10);

        if (newZoom < 60) {
            $(this).parent().find('.zoom-in-enabled').addClass('hidden')
            $(this).parent().find('.zoom-in-disabled').removeClass('hidden')
            $(this).attr('disabled', true);
        } else {
            $(this).parent().find('.zoom-in-enabled').removeClass('hidden')
            $(this).parent().find('.zoom-in-disabled').addClass('hidden')
            $(this).attr('disabled', false);
        }

        if (newZoom > 110) {
            $(this).parent().find('.zoom-out-enabled').addClass('hidden')
            $(this).parent().find('.zoom-out-disabled').removeClass('hidden')
            $(this).parent().find('.zoom-out').attr('disabled', true);
        } else {
            $(this).parent().find('.zoom-out-enabled').removeClass('hidden')
            $(this).parent().find('.zoom-out-disabled').addClass('hidden')
            $(this).parent().find('.zoom-out').attr('disabled', false);
        }

    });
    $('.zoom-out').on('click', function (e) {
        
        let panoIndex = $(this).closest('.panorama').attr('index');
        panoIndex = parseInt(panoIndex) - 1;
        
        let newZoom = viewers[panoIndex].getHfov() + 10;
        
        viewers[panoIndex].setHfov(viewers[panoIndex].getHfov() + 10);

        if (newZoom < 60) {
            $(this).parent().find('.zoom-in-enabled').addClass('hidden')
            $(this).parent().find('.zoom-in-disabled').removeClass('hidden')
            $(this).parent().find('.zoom-in').attr('disabled', true);
        } else {
            $(this).parent().find('.zoom-in-enabled').removeClass('hidden')
            $(this).parent().find('.zoom-in-disabled').addClass('hidden')
            $(this).parent().find('.zoom-in').attr('disabled', false);
        }

        if (newZoom > 110) {
            $(this).parent().find('.zoom-out-enabled').addClass('hidden')
            $(this).parent().find('.zoom-out-disabled').removeClass('hidden')
            $(this).attr('disabled', true);
        } else {
            $(this).parent().find('.zoom-out-enabled').removeClass('hidden')
            $(this).parent().find('.zoom-out-disabled').addClass('hidden')
            $(this).attr('disabled', false);
        }
        
    });

    $('.fullscreen').on('click', function (e) {
        let panoIndex = $(this).closest('.panorama').attr('index');
        panoIndex = parseInt(panoIndex) - 1;
        $(this).toggleClass('open')
        viewers[panoIndex].toggleFullscreen();
    });

    let currentHotspotInView;



    $('.nexthotspot').on('click', function (e) {

        let panoIndex = $(this).closest('.panorama').attr('index');
        panoIndex = parseInt(panoIndex) - 1;

        let pano = $(this).closest('.panorama');

        currentHotspotInView = $(pano).find('.isNextHotspot');
        let currentHotspotContent = currentHotspotInView.text();

        let currentIndex = parseInt(currentHotspotInView.attr('index'));
        let totalHotspots = $(pano).find('.custom-hotspot').length;

        let previousHotspot;
        let nextHotspot;

        let nextIndex = currentIndex + 1;
        let prevIndex = currentIndex - 1;

        if(nextIndex > totalHotspots){
            nextIndex = 1;
        }

        if(prevIndex < 1){
            prevIndex = totalHotspots;
        }

        // if currentindex = max >> next goes to first; if current index = 1 >> prev goes to last
        $(pano).find('.custom-hotspot').each(function(){
            $(this).removeClass('isNextHotspot')
            $(this).removeClass('isPrevHotspot')
            if($(this).attr('index') == nextIndex) {
                nextHotspot = $(this);
            }

            if($(this).attr('index') == prevIndex) {
                previousHotspot = $(this);
            }
        })

        $(pano).find('.pano-modal.active .close-modal').click();

        let nextYaw;
        let nextPitch;

        $(pano).find('.pano-hotspots .hs-content').each(function () {
            let htmlHotspot = $(this)
            let hotspotSpanText = $(htmlHotspot).text();

            $(htmlHotspot).removeClass('isCurrentHotspot')

            if (hotspotSpanText == currentHotspotContent) {
                nextYaw = $(htmlHotspot).attr('data-yaw');
                nextPitch = $(htmlHotspot).attr('data-pitch');
            }
        })

        viewers[panoIndex].setYaw(nextYaw);
        viewers[panoIndex].setPitch(nextPitch);

        // move class to NEXT + PREVIOUS hotspots
        $(currentHotspotInView).removeClass('isNextHotspot')
        $(currentHotspotInView).addClass('isCurrentHotspot')
        $(nextHotspot).addClass('isNextHotspot')
        $(previousHotspot).addClass('isPrevHotspot')

        $(currentHotspotInView).click();

    })
    
    $('.previoushotspot').on('click', function (e) {

        let panoIndex = $(this).closest('.panorama').attr('index');
        panoIndex = parseInt(panoIndex) - 1;

        let pano = $(this).closest('.panorama');

        currentHotspotInView = $(pano).find('.isPrevHotspot');
        let currentHotspotContent = currentHotspotInView.text();

        let currentIndex = parseInt(currentHotspotInView.attr('index'));
        let totalHotspots = $(pano).find('.custom-hotspot').length;

        let previousHotspot;
        let nextHotspot;

        let nextIndex = currentIndex + 1;
        let prevIndex = currentIndex - 1;

        if(nextIndex > totalHotspots){
            nextIndex = 1;
        }

        if(prevIndex < 1){
            prevIndex = totalHotspots;
        }

        // if currentindex = max >> next goes to first; if current index = 1 >> prev goes to last
        $(pano).find('.custom-hotspot').each(function(){
            $(this).removeClass('isNextHotspot')
            $(this).removeClass('isPrevHotspot')
            if($(this).attr('index') == nextIndex) {
                nextHotspot = $(this);
            }

            if($(this).attr('index') == prevIndex) {
                previousHotspot = $(this);
            }
        })

        $(pano).find('.pano-modal.active').click();

        let nextYaw;
        let nextPitch;

        $(pano).find('.pano-hotspots .hs-content').each(function () {
            let htmlHotspot = $(this)
            let hotspotSpanText = $(htmlHotspot).text();

            $(htmlHotspot).removeClass('isCurrentHotspot')

            if (hotspotSpanText == currentHotspotContent) {
                nextYaw = $(htmlHotspot).attr('data-yaw');
                nextPitch = $(htmlHotspot).attr('data-pitch');
            }
        })

        viewers[panoIndex].setYaw(nextYaw);
        viewers[panoIndex].setPitch(nextPitch);

        // move class to NEXT + PREVIOUS hotspots
        $(currentHotspotInView).removeClass('isPrevHotspot')
        $(currentHotspotInView).addClass('isCurrentHotspot')
        $(nextHotspot).addClass('isNextHotspot')
        $(previousHotspot).addClass('isPrevHotspot')

        $(currentHotspotInView).click();

    })

    $('.vo-content button').on('click touch', function(){
        console.log('sup')
    })
})