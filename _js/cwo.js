
// OBJECT CONSTRUCTOR. TAKES THE JSON KEY-VALUES AS PARAMS. 
function oCharacterData(codename,realname,statusof,alignment,type,team,antiregistration,haspicture,picurl) {
	this.codename = codename;
	this.realname = realname;
	this.statusof = statusof;
	this.alignment = alignment;
	this.type = type;
	this.team = team;
	this.antiregistration = antiregistration;
	this.haspicture = haspicture;
	this.picurl = picurl;
	this.container = null;
	this.img = null;
	return this;
}

// ADDING THE MAKEDIV METHOD TO THE PROTOTYPE
oCharacterData.prototype.makeDiv = function() {
	this.container = document.createElement('div');
	this.container.setAttribute("class","soldier");
	this.container.setAttribute("id", this.codename);
	// ADDING ATTRIBUTES TO THE DIVS, BASED ON THE JSON OBJECTS
	// CHANGED TO CAMELCASE AT THIS POINT
	this.container.setAttribute("codename", this.codename);
	this.container.setAttribute("realname", this.realname);
	this.container.setAttribute("statusof", this.statusof);
	this.container.setAttribute("alignment",this.alignment);
	this.container.setAttribute("type",this.type);
	this.container.setAttribute("team",this.team);
	this.container.setAttribute("antiregistration",this.antiregistration);
	this.container.setAttribute("haspicture",this.haspicture);
	this.container.setAttribute("picurl",this.picurl);
	
	this.img = document.createElement('img');
	this.img.setAttribute('src', this.picurl);
	this.container.appendChild(this.img);
	
	var hTag = document.createElement("h4");
	hTag.innerHTML = this.codename;
	this.container.appendChild(hTag);
	return this;
}


var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?key=0Ang1OfZPG6vydHc2SFNxanc3bXh0SVc5Zm5NQnVKRGc&output=html';


$(document).ready(function(){ 
	
	// EMPTY ARRAY
	
	var init = function() {
		Tabletop.init( { key: public_spreadsheet_url,
		callback: useData} );
	};

	//Call back for the Tabletop function
	var useData = function(data, tabletop) {
		console.log(tabletop.models["characters"].elements[0].picurl);
		imagePreload(tabletop.models["characters"].elements);
		var characterData = tabletop.models["characters"].elements;
		var issueTimeline = tabletop.models["timeline"].elements;
		getCharacters(characterData);
		getIssues(issueTimeline);
		runIsotope();
		$('#aReg, #pReg').css({'background-image':'none'});
		tooltipController();
		overlayController();
	};
	
	
	var imagePreload = function(source) {
		var images = [];
		for(i=0;i<source.length;i++) {
			images.push(source[i].picurl);
		}
		$(images).each(function(){
			var image = $('<img />').attr('src', this);
		});
	};
	
	var characterObjs = [];
	var issueIDs = [];
	
	// FUNCTION THAT LOOPS OVER JSON AND CREATES OBJECTS, THEN ADDS TO CHARACTEROBJS ARRAY.
	var getCharacters = function(characterData) {
		
	 	for(i=0; i < characterData.length; i++) { 
	 		var character = new oCharacterData(characterData[i].codename,characterData[i].realname,characterData[i].statusof,characterData[i].alignment,characterData[i].type,characterData[i].team,characterData[i].antiregistration,characterData[i].haspicture,characterData[i].picurl);
	 		characterObjs.push(character);
	 	}
	 	// SORTS THE ARRAY 
		characterObjs.sort(function(a, b) {
		  if (a.codename < b.codename)
		    return -1;
		  else if (a.codename > b.codename)
		    return 1;
		  return 0;
		});
		
		// LOOPS OVER THE NOW FULL CHARACTEROBJS ARRAY AND ADDS THEM TO THE DOM.
		for(j=0; j < characterObjs.length; j++) {
			
			if (characterObjs[j].antiregistration == "TRUE") {
				$('#aReg').append(characterObjs[j].makeDiv().container);
			} 
			if (characterObjs[j].antiregistration == "FALSE") {
				$('#pReg').append(characterObjs[j].makeDiv().container);
			};
		}
		$('.soldier').animate({'opacity':1});
	};
	
	// LOOPS OVER TIMELINE JSON AND ADDS ISSUE NAMES TO THE DOM.
	var getIssues = function(issueTimeline){
		
		for(i=0; i < issueTimeline.length; i++) {
			$('<option></option>').val(issueTimeline[i].id).html(issueTimeline[i].issue).appendTo($('select#issues'));
			issueIDs.push(issueTimeline[i].id);
		}
		
	};
	
	
	
	
	// STARTS THE FUNCTION AND ADDS THE CHARACTERS TO THEIR CONTAINERS
	init();
	
	// MASONRY TEST
	var $containerLeft = $('#aReg');
	var $containerRight = $('#pReg');
	   
	var runIsotope = function() { 
		$containerLeft.isotope({itemSelector : '.soldier', singleMode:true, isAnimated: true, isAnimatedFromBottom: true});
		$containerRight.isotope({itemSelector : '.soldier', singleMode:true, isAnimated: true, isAnimatedFromBottom: true});
	};
	
	
    

	
	///---------------------------------------------------------------------------///
	// (ADVANCED HIDING OF DIVS, BASED ON NEWLY-MINTED ISOTOPE FILTERS)
	// FILTER BY STANCE: ANTI- OR PRO-REGISTRATION 

	$('#nav-content ul h4 span.allSides').click(function(){
		var soldier = $('.soldier');
		$containerLeft.isotope({ filter: soldier });
		$containerRight.isotope({ filter: soldier });
		$('#nav-content li').removeClass("buttonON");
		return false;
	});
	
	$('#antiReg').click(function(){
		var soldier = $('.soldier').filter(function(){
			var item = $(this);
			var stat = item.attr('antiregistration');
			return (stat == "TRUE");
		});
		$containerLeft.isotope({ filter: soldier });
		$containerRight.isotope({ filter: soldier });
		return false;
	});
	
	$('#proReg').click(function(){
		var soldier = $('.soldier').filter(function(){
			var item = $(this);
			var stat = item.attr('antiregistration');
			return (stat == "FALSE");
		});
		$containerLeft.isotope({ filter: soldier });
		$containerRight.isotope({ filter: soldier });
		return false;
	});


	///---------------------------------------------------------------------------///
	// FILTER BY STATUS: ACTIVE, DECEASED, CAPTURED, OTHER
	
	var filterByStatus = function(status) {
			var soldier = $('.soldier').filter(function(){
				var item = $(this);
				var stat = item.attr('statusof');
				if (status == 'other') {
					return (stat != "active" && stat != "deceased" && stat != "captured");
				} else {
					return (stat == status);
				}
			});
			$containerLeft.isotope({ filter: soldier });
			$containerRight.isotope({ filter: soldier });
			return false;
	};
	
	$('#active').click(function(){ filterByStatus('active'); });
	$('#deceased').click(function(){ filterByStatus('deceased'); });
	$('#captured').click(function(){ filterByStatus('captured'); });
	$('#other').click(function(){ filterByStatus('other'); });
	
	
	///---------------------------------------------------------------------------///
	// FILTER BY ALIGNMENT: HERO. VILLAIN. OTHER.
	
	var filterByAlignment = function(alignment) {
			var soldier = $('.soldier').filter(function(){
				var item = $(this);
				var stat = item.attr('alignment');
				return (stat == alignment);
			});
			$containerLeft.isotope({ filter: soldier });
			$containerRight.isotope({ filter: soldier });
			return false;
	};
	
	$('#alignHero').click(function(){ filterByAlignment('hero'); });
	$('#alignVillain').click(function(){ filterByAlignment('villain'); });
	$('#alignAmbiguous').click(function(){ filterByAlignment('unknown'); });
	

	
	///---------------------------------------------------------------------------///
	// FILTER BY POWER TYPE: SUPERHUMAN. MUTANT. MYSTIC. HUMAN.
	
	var filterByType = function(type) {
			var soldier = $('.soldier').filter(function(){
				var item = $(this);
				var stat = item.attr('type');
				return (stat == type);
			});
			$containerLeft.isotope({ filter: soldier });
			$containerRight.isotope({ filter: soldier });
			return false;
	};
	
	$('#typeSuperhuman').click(function(){ filterByType('superhuman'); });
	$('#typeMutant').click(function(){ filterByType('mutant'); });
	$('#typeMystic').click(function(){ filterByType('mystical'); });
	$('#typeHuman').click(function(){ filterByType('human'); });

	
		
	///---------------------------------------------------------------------------///

	// FILTER BY TEAM AFFILIATIONS
	var filterByTeam = function(team, alt_team, alt_team2) {
			var soldier = $('.soldier').filter(function(){
				var item = $(this);
				var stat = item.attr('team');
				return (stat == team || stat == alt_team);
			});
			$containerLeft.isotope({ filter: soldier });
			$containerRight.isotope({ filter: soldier });
			return false;
	};
	
	// SWITCH STATEMENT FOR TEAM AFFILIATIONS
	$('select#teams').change(function(){ 
		$('select#issues').prop('selectedIndex',0);
		switch($('select#teams').val()) {
			case 'teamAvengers':
			filterByTeam('Avengers','Secret Avengers');
			break;
			case 'teamBADGirls':
			filterByTeam('B.A.D. Girls Inc.');
			break;
			case 'teamChampions':
			filterByTeam('Champions');
			break;
			case 'teamFantastic4':
			filterByTeam('Fantastic Four');
			break;
			case 'teamHeroes4Hire':
			filterByTeam('Heroes For Hire');
			break;
			case 'teamSHIELD':
			filterByTeam('S.H.I.E.L.D.');
			break;
			case 'teamInitiative':
			filterByTeam('The Initiative');
			break;
			case 'teamThunderbolts':
			filterByTeam('Thunderbolts','Thunderbolts Army');
			break;
			case 'teamXFactor':
			filterByTeam('X-Factor Investigations');
			break;
			case 'teamXMen':
			filterByTeam('X-Men');
			break;
			case 'teamAvatars':
			filterByTeam('Mandarin\'s Avatars');
			break;
			case 'teamCommission':
			filterByTeam('Commission');
			break;
			case 'teamRunaways':
			filterByTeam('Runaways');
			break;
			case 'teamYAvengers':
			filterByTeam('Young Avengers');
			break;
		}
	});
	
	
	
	// API CALL TO COMICVINE. STORES CHARACTER CREDITS IN AN ARRAY ON CLICK OF EACH ISSUE.
	$('#issues').change(function(){
		var inEachIssue = [];
		var issueID = $(this).val();
		$('select#teams').prop('selectedIndex',0);
		$('#nav-content li').removeClass("buttonON");
		
		$.ajax('http://api.comicvine.com/issue/' + issueID + '/?api_key=1072ebc7387e94c18d3b07e115fcbc9115c3dd14&format=jsonp&json_callback=?&field_list=character_credits', {
			type:'GET',
			dataType: 'jsonp',
			jsonp: 'jsonp',
			cache: false,
			success: function createListOfNames(result){
				for(i=0;i<result.results.character_credits.length;i++) {
					inEachIssue.push(result.results.character_credits[i].name);
				}
				filterByAppearance(inEachIssue);
				console.log(inEachIssue);
			},
			error: function() {
				alert('Fail Blog!');
			}
		});

	});


	//THE FILTER BY ISSUE APPEARANCE FUNCTION
	var filterByAppearance = function(arr) {
			var soldier = $('.soldier').filter(function(){
				var item = $(this);
				var codeName = item.attr('codename');
				var realName = item.attr('realname');
				return (arr.indexOf(codeName) != -1 || arr.indexOf(realName) != -1 );
			});
			$containerLeft.isotope({ filter: soldier });
			$containerRight.isotope({ filter: soldier });
			return false;
	};
	
	
	// --------------- FURNITURE SCRIPTS -------------------- //
	
	// TO HIGHLIGHT THE SELECTED BUTTON
	$('#nav-content li').click(function(){
		$('#nav-content li').removeClass("buttonON");
		$('select#issues, select#teams').prop('selectedIndex',0);
		$(this).addClass("buttonON");
	});
	
	
	
	
	var stanceTranslate = function(attrib, arg) {
		if (attrib == "antiregistration" && arg.attr(attrib) == "TRUE") {
			return "Anti-Registration"
		} else {
			return "Pro-Registration"
		}
	};
	
	
	var valueTranslate = function(attrib,arg) {
		if (attrib == "team" && arg.attr(attrib) == "null") {
			return "none";
		} else if (arg.attr(attrib) == "null") {
				return "unknown";
		} else {
			return arg.attr(attrib);
		}
	};
	
	
	//DISPLAY CHARACTER DATA ON HOVER
	
	var tooltipController = function(){
		$('.soldier').hover(function(e){
			$('div .tooltip').stop().appendTo('#main').show();
			$(this).mousemove(function(e){
				var alph = $(this);
				var tooltip = $('div .tooltip');
				var xPos = e.pageX;
				var yPos = e.pageY;
				$('div .tooltip .codename').html(alph.attr('codename'));
				$('div .tooltip .realname').html(valueTranslate('realname',alph));
				$('div .tooltip .alignment').html(alph.attr('alignment'));
				$('div .tooltip .statusof').html(alph.attr('statusof'));
				$('div .tooltip .type').html(alph.attr('type'));
				$('div .tooltip .team').html(valueTranslate('team',alph));
				$('div .tooltip .antiregistration').html(stanceTranslate('antiregistration',alph));
				tooltip.css({'left': xPos - 150, 'top': yPos - 350});
			});
			}, function(){
				$('div .tooltip').hide();
		});
	};
	
	
	
	
	var overlayController = function(){
		
		//OVERLAY APPEARANCE
		$('.soldier').click(function(){
			var alph = $(this);
			var win = $(window);
			var overlay = $('#display-character');
			var x = (win.width() - overlay.width()) / 2;
			var y = (win.height() - overlay.height()) / 2;
			$('#display-character h1').html(alph.attr('codename'));
			$('#display-character img').attr('src','http://troyericgriggs.com/projects/cwo/_files/images/' + alph.attr('codename').toUpperCase() + '.jpeg');
			$('#display-character ul.col-image li a:eq(0)').attr('href','http://www.comicvine.com/search/?q=' + alph.attr('codename'));
			$('#display-character ul.col-image li a:eq(1)').attr('href','http://marvel.com/search/?q=' + alph.attr('codename'));
			$('#display-character .col-stats li:eq(1)').html(valueTranslate('realname',alph));
			$('#display-character .col-stats li:eq(3)').html(alph.attr('alignment'));
			$('#display-character .col-stats li:eq(5)').html(alph.attr('statusof'));
			$('#display-character .col-stats li:eq(7)').html(alph.attr('typeof'));
			$('#display-character .col-stats li:eq(9)').html(valueTranslate('team',alph));
			$('#display-character .col-stats li:eq(11)').html(stanceTranslate('antiregistration',alph));
			$('#display-bg').appendTo('body').show().animate({opacity:0.7},'normal');
			$('#display-character').css({'left': x, 'top': y + $(document).scrollTop() - 100}).appendTo('body').show().animate({opacity:1},'normal');

			getAppearances(issueIDs);
		});

		//OVERLAY DISAPPEARANCE
		$('#display-bg').click(function(){
			$('#display-character').hide().css({'opacity':0});
			$(this).hide().css({'opacity':0});
		});
	};
	
	
	
	// FOR A FIXED TOP NAV WHEN SCROLLING
	$(window).scroll(function() {
		var $win = $(window);
		var $nav = $("#nav");
		
		if (!$nav.hasClass("fixed") && ($win.scrollTop() > $nav.offset().top)) {
			$nav.addClass("fixed").data("top", $nav.offset().top).animate({'opacity':'0.85'},'slow');
	} else if ($nav.hasClass("fixed") && ($win.scrollTop() < $nav.data("top"))) {
		$nav.removeClass("fixed");
	}});
	
	
	
	var getAppearances = function(issueTimeline){
		for(i=0; i < issueTimeline.length; i++) {
			ajaxIssues(issueTimeline[i]);
		}
	};
	
	
	var ajaxIssues = function(issueID){
		
		var codeName = $('#display-character h1');
		var realName = $('#display-character ul.col-stats li:eq(1)');
		$('#display-character .col-appearances ul').html('');
		$('#display-character h6.label').css({'background-image':'url("http://troyericgriggs.com/projects/cwo/_files/images/_icons/issue_loader.gif")'});
		
		$.ajax('http://api.comicvine.com/issue/' + issueID + '/?api_key=1072ebc7387e94c18d3b07e115fcbc9115c3dd14&format=jsonp&json_callback=?&field_list=character_credits,volume,issue_number', {
			type:'GET',
			dataType: 'jsonp',
			jsonp: 'jsonp',
			cache: false,
			success: function createListOfNames(result){
				for(i=0;i<result.results.character_credits.length;i++) {
					if (result.results.character_credits[i].name == codeName.html() || result.results.character_credits[i].name == realName.html()) {
						$('<li></li>').html(result.results.volume.name + " " + parseInt(result.results.issue_number).toFixed()).appendTo('#display-character .col-appearances ul');
					}
				} 
				$('#display-character h6.label').delay(200).css({'background-image':'none'});
			},
			error: function() {
				console.log('Fail Blog!');
			}
		});
	};
	
	
	
});
		
