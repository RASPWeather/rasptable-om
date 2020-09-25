// The names of the models supported from the - is the root of everything as the KVP to other configuration elements
const jcModelList = ' { "models":  [ "UK2", "UK4", "UK12", "UKGW1", "UKGM" ] }';

const jcAirSpaceFileNameList = '\
{ "airspace":  \
	[ \
		{ \
			"name": "A", \
			"description": "Class A", \
			"enabled": true, \
			"filename": "class_a.json" \
        }, \
		{ \
			"name": "C", \
			"description": "Class C", \
			"enabled": true, \
			"filename": "class_c.json" \
        }, \
		{ \
			"name": "D", \
			"description": "Class D", \
			"enabled": true, \
			"filename": "class_d.json" \
        }, \
		{ \
			"name": "E", \
			"description": "Class E", \
			"enabled": true, \
			"filename": "class_e.json" \
        }, \
		{ \
			"name": "G", \
			"description": "Class G", \
			"enabled": true, \
			"filename": "class_g.json" \
        }, \
		{ \
			"name": "X", \
			"description": "Class X", \
			"enabled": true, \
			"filename": "class_x.json" \
        } \
	] \
}';

// Used for the selectors and for auto populating other structures
const jcFullSupportedModels = ' \
{ "models":  \
    [ \
        { \
            "name": "UK2", \
            "description": "UK 2Km (Fine)", \
            "enabled": true, \
            "fullname": "UK 2Km (+0->+1)", \
            "url": "http:// ...", \
            "centre":    ["54.3964386", "-3.9669495"],  \
            "swcorner": ["49.4383430", "-10.7258911"], \
            "necorner": ["59.3545303", "2.7919922"],	\
            "resolution": 2000, \
            "zoom": 6, \
            "parameters": ["wstar_bsratio","wstar","bsratio","hwcrit","dwcrit","hbl","dbl","hglider","bltopvariab","experimental1","zwblmaxmin","sfcshf","sfcsunpct","sfctemp","sfcdewpt","mslpress","sfcwind0","sfcwind","blwind","bltopwind","blwindshear","wblmaxmin","zsfclcldif","zsfclcl","zsfclclmask","zblcldif","zblcl","zblclmask","blcwbase","blcloudpct","rain1","cape","blicw","press1000","press950","press850","press700","press500","stars","starshg"], \
            "soundings": ["sounding1","sounding2","sounding3","sounding4","sounding5","sounding6","sounding7","sounding8","sounding9","sounding10","sounding11","sounding12","sounding13","sounding14","sounding15","sounding16"], \
			"trackaverage": false, \
            "days": ["","+1"], \
			"plot_hours": [ \
				{ \
					"day" : "", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100"] \
				}, \
				{ \
					"day" : "1", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800"] \
				} \
			] \
        }, \
        { \
            "name": "UK4", \
            "description": "UK 4Km (Medium)", \
            "enabled": true, \
            "fullname": "UK 4Km (+0->+2)", \
            "url": "http:// ...", \
            "centre":    ["54.5004349", "-4.1115112"],  \
            "swcorner": ["49.3974648", "-10.9672241"], \
            "necorner": ["59.6034050", "2.7442017"],	\
            "resolution": 4000, \
            "zoom": 6, \
            "parameters": ["wstar_bsratio","wstar","bsratio","hwcrit","dwcrit","hbl","dbl","hglider","bltopvariab","experimental1","zwblmaxmin","sfcshf","sfcsunpct","sfctemp","sfcdewpt","mslpress","sfcwind0","sfcwind","blwind","bltopwind","blwindshear","wblmaxmin","zsfclcldif","zsfclcl","zsfclclmask","zblcldif","zblcl","zblclmask","blcwbase","blcloudpct","rain1","cape","blicw","press1000","press950","press850","press700","press500","stars","starshg"], \
			"trackaverage": true, \
            "days": ["","+1","+2"], \
			"plot_hours": [ \
				{ \
					"day" : "", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100"] \
				}, \
				{ \
					"day" : "1", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800"] \
				}, \
				{ \
					"day" : "2", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800"] \
				} \
			] \
        }, \
        { \
            "name": "UK12", \
            "description": "UK 12Km (Coarse)", \
            "enabled": true, \
            "fullname": "UK 12Km (+0->+6)", \
            "url": "http:// ...", \
            "centre":    ["54.2952499", "-4.1747437"],  \
            "swcorner": ["48.8365898", "-11.6136475"], \
            "necorner": ["59.7539062", "3.2641602"],	\
            "resolution": 12000, \
            "zoom": 6, \
            "parameters": ["wstar_bsratio","wstar","bsratio","hwcrit","dwcrit","hbl","dbl","hglider","bltopvariab","experimental1","zwblmaxmin","sfcshf","sfcsunpct","sfctemp","sfcdewpt","mslpress","sfcwind0","sfcwind","blwind","bltopwind","blwindshear","wblmaxmin","zsfclcldif","zsfclcl","zsfclclmask","zblcldif","zblcl","zblclmask","blcwbase","blcloudpct","rain1","cape","blicw","press1000","press950","press850","press700","press500","stars","starshg"], \
			"trackaverage": true, \
            "days": ["","+1","+2","+3","+4","+5","+6"], \
			"plot_hours": [ \
				{ \
					"day" : "", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100"] \
				}, \
				{ \
					"day" : "1", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800"] \
				}, \
				{ \
					"day" : "2", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800"] \
				}, \
				{ \
					"day" : "3", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800"] \
				}, \
				{ \
					"day" : "4", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800"] \
				}, \
				{ \
					"day" : "5", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800"] \
				}, \
				{ \
					"day" : "6", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800"] \
				} \
			] \
        }, \
        { \
            "name": "UKGW1", \
            "description": "Wales (Fine)", \
            "enabled": true, \
            "fullname": "Wales 1Km (+0->+1)", \
            "url": "http:// ...", \
            "centre":    ["52.4984894", "-3.6540833"],  \
            "swcorner": ["51.5690498", "-4.7105713"], \
            "necorner": ["53.4279251", "-2.5975952"],	\
            "resolution": 1000, \
            "zoom": 8, \
            "parameters": ["wstar_bsratio","wstar","bsratio","hwcrit","dwcrit","hbl","dbl","hglider","bltopvariab","experimental1","zwblmaxmin","sfcshf","sfcsunpct","sfctemp","sfcdewpt","sfcwind0","sfcwind","blwind","bltopwind","blwindshear","wblmaxmin","zsfclcldif","zsfclcl","zsfclclmask","zblcldif","zblcl","zblclmask","blcwbase","blcloudpct","blcloudpct","rain1","cape","blicw","press1000","press950","press850","press700","press500","stars","starshg"], \
			"trackaverage": false, \
            "days": ["","+1"], \
			"plot_hours": [ \
				{ \
					"day" : "", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100"] \
				}, \
				{ \
					"day" : "1", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800"] \
				} \
			] \
        }, \
{ \
            "name": "UKGM", \
            "description": "Scotland (Fine)", \
            "enabled": true, \
            "fullname": "Scotland 2Km (+0->+1)", \
            "url": "http:// ...", \
            "centre":    ["56.9220657", "-3.7412415"],  \
            "swcorner": ["54.8940773", "-6.6961670"], \
            "necorner": ["58.9500580", "-0.7863159"],	\
            "resolution": 2000, \
            "zoom": 7, \
            "parameters": ["wstar_bsratio","wstar","bsratio","hwcrit","dwcrit","hbl","dbl","hglider","bltopvariab","experimental1","zwblmaxmin","sfcshf","sfcsunpct","sfctemp","sfcdewpt","mslpress","sfcwind0","sfcwind","blwind","bltopwind","blwindshear","wblmaxmin","zsfclcldif","zsfclcl","zsfclclmask","zblcldif","zblcl","zblclmask","blcwbase","blcloudpct","blcloudpct","rain1","cape","blicw","press1000","press950","press850","press700","press500","stars","starshg"], \
			"trackaverage": false, \
            "days": ["","+1"], \
			"plot_hours": [ \
				{ \
					"day" : "", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100"] \
				}, \
				{ \
					"day" : "1", \
					"hours" : ["0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800"] \
				} \
			] \
        } \
	] \
}'; 

const jcFullSupportedParameters = ' \
{ "parameters":  \
    [ \
        { "name": "wstar_bsratio",  "longname": "Thermal Updraft Velocity & B/S Ratio",             "primary": true,     "description": "description" }, \
        { "name": "wstar",          "longname": "Thermal Updraft Velocity (W*)",                    "primary": true,     "description": "description" }, \
        { "name": "bsratio",        "longname": "Buoyancy/Shear Ratio",                             "primary": false,    "description": "description" }, \
        { "name": "hwcrit",         "longname": "Ht of Critical Updraft Strength (225fpm)",         "primary": false,    "description": "description" }, \
        { "name": "dwcrit",         "longname": "Depth of Critical Updraft Strength (AGL Hcrit)",   "primary": false,    "description": "description" }, \
        { "name": "hbl",            "longname": "BL Top",                                           "primary": false,    "description": "description" }, \
        { "name": "dbl",            "longname": "BL Depth",                                         "primary": false,    "description": "description" }, \
        { "name": "hglider",        "longname": "Thermalling Height",                               "primary": true,     "description": "description" }, \
        { "name": "bltopvariab",    "longname": "Thermal Height Uncertainty",                       "primary": false,    "description": "description" }, \
        { "name": "experimental1",  "longname": "Ht of Critical Updraft Strength (175fpm)",         "primary": false,    "description": "description" }, \
        { "name": "zwblmaxmin",     "longname": "MSL Height of max/min Wbl",                        "primary": false,    "description": "description" }, \
        { "name": "sfcshf",         "longname": "Surface Heating",                                  "primary": false,    "description": "description" }, \
        { "name": "sfcsunpct",      "longname": "Normalized Sfc. Sun",                              "primary": false,    "description": "description" }, \
        { "name": "sfctemp",        "longname": "Sfc.Temperature",                                  "primary": true,     "description": "description" }, \
        { "name": "sfcdewpt",       "longname": "Sfc.Dew Point",                                    "primary": false,    "description": "description" }, \
        { "name": "mslpress",       "longname": "MSL Pressure",                                     "primary": false,    "description": "description" }, \
        { "name": "sfcwind0",       "longname": "Sfc.Wind (2m)",                                    "primary": true,     "description": "description" }, \
        { "name": "sfcwind",        "longname": "Sfc.Wind (10m)",                                   "primary": true,     "description": "description" }, \
        { "name": "blwind",         "longname": "BL Avg. Wind",                                     "primary": true,     "description": "description" }, \
        { "name": "bltopwind",      "longname": "Wind at BL Top",                                   "primary": false,    "description": "description" }, \
        { "name": "blwindshear",    "longname": "BL Wind Shear",                                    "primary": false,    "description": "description" }, \
        { "name": "wblmaxmin",      "longname": "BL Max. Up/Down (Convergence)",                    "primary": true,     "description": "description" }, \
        { "name": "zsfclcldif",     "longname": "Cu Potential",                                     "primary": false,    "description": "description" }, \
        { "name": "zsfclcl",        "longname": "Cu Cloudbase (Sfc.LCL) MSL",                       "primary": false,    "description": "description" }, \
        { "name": "zsfclclmask",    "longname": "Cu Cloudbase where CuPotential > 0",               "primary": true,     "description": "description" }, \
        { "name": "zblcldif",       "longname": "OD Potential",                                     "primary": false,    "description": "description" }, \
        { "name": "zblcl",          "longname": "OD Cloudbase (BL CL) MSL",                         "primary": false,    "description": "description" }, \
        { "name": "zblclmask",      "longname": "OD Cloudbase where ODpotential > 0",               "primary": false,    "description": "description" }, \
        { "name": "blcwbase",       "longname": "BL Cld-Base if CloudWater predicted",              "primary": false,    "description": "description" }, \
        { "name": "blcloudpct",     "longname": "BL Cloud Cover",                                   "primary": false,    "description": "description" }, \
        { "name": "rain1",          "longname": "Rain",                                             "primary": true,     "description": "description" }, \
        { "name": "cape",           "longname": "CAPE",                                             "primary": false,    "description": "description" }, \
        { "name": "blicw",          "longname": "BL Integrated Cloud Water",                        "primary": false,    "description": "description" }, \
        { "name": "press1000",      "longname": "Vertical Velocity at 1000mb",                      "primary": false,    "description": "press1000 description" }, \
        { "name": "press950",       "longname": "Vertical Velocity at 950mb",                       "primary": false,    "description": "press950 description" }, \
        { "name": "press850",       "longname": "Vertical Velocity at 850mb",                       "primary": true,     "description": "press850 description" }, \
        { "name": "press700",       "longname": "Vertical Velocity at 700mb",                       "primary": false,    "description": "press700 description" }, \
        { "name": "press500",       "longname": "Vertical Velocity at 500mb",                       "primary": false,    "description": "press500 description" }, \
        { "name": "stars",          "longname": "Star Rating",                                      "primary": true,     "description": "stars description" }, \
        { "name": "starshg",        "longname": "Star Rating - Foot Launchers",                     "primary": true,     "description": "starshg description" } \
    ] \
}'; 

const jcModelSoundings = ' \
{ "soundings":  \
    [ \
        { "model": "UK2", \
            "location":[ \
                { "name": "Exeter",          "centre": ["50.7344",   "-3.4139"] }, \
                { "name": "Fairford",        "centre": ["51.682",    "-1.7900"] }, \
                { "name": "Herstmonceaux",   "centre": ["50.8833",   "0.3333"] }, \
                { "name": "Newtown",         "centre": ["52.5157",   "-3.300"] }, \
                { "name": "Cambridge",       "centre": ["52.2050",   "0.1750"] }, \
                { "name": "Nottingham",      "centre": ["52.9667",   "-1.1667"] }, \
                { "name": "Cheviots",        "centre": ["55.5",      "-2.2"] }, \
                { "name": "Callander",       "centre": ["56.2500",   "-4.2333"] }, \
                { "name": "Aboyne",       	 "centre": ["57.0833",   "-2.8333"] }, \
                { "name": "Buckingham",      "centre": ["52.0000",   "-0.9833"] }, \
                { "name": "Larkhill",        "centre": ["51.2000",   "-1.8167"] }, \
                { "name": "Leeds",           "centre": ["53.869",    "-1.650"] }, \
                { "name": "Carrickmore",     "centre": ["54.599",    "-7.049"] }, \
                { "name": "CastorBay NI",    "centre": ["54.5",      "-6.33"] }, \
                { "name": "Talgarth",        "centre": ["51.979558", "-3.206081"] }, \
                { "name": "Camphill",        "centre": ["53.305",    "-1.7291"] } \
            ] \
        }, \
        { "model": "UK4", \
            "location":[ \
                { "name": "Exeter",          "centre": ["50.7344",   "-3.4139"] }, \
                { "name": "Fairford",        "centre": ["51.682",    "-1.7900"] }, \
                { "name": "Herstmonceaux",   "centre": ["50.8833",   "0.3333"] }, \
                { "name": "Newtown",         "centre": ["52.5157",   "-3.300"] }, \
                { "name": "Cambridge",       "centre": ["52.2050",   "0.1750"] }, \
                { "name": "Nottingham",      "centre": ["52.9667",   "-1.1667"] }, \
                { "name": "Cheviots",        "centre": ["55.5",      "-2.2"] }, \
                { "name": "Callander",       "centre": ["56.2500",   "-4.2333"] }, \
                { "name": "Aboyne",       	 "centre": ["57.0833",   "-2.8333"] }, \
                { "name": "Buckingham",      "centre": ["52.0000",   "-0.9833"] }, \
                { "name": "Larkhill",        "centre": ["51.2000",   "-1.8167"] }, \
                { "name": "Leeds",           "centre": ["53.869",    "-1.650"] }, \
                { "name": "Carrickmore",     "centre": ["54.599",    "-7.049"] }, \
                { "name": "CastorBay NI",    "centre": ["54.5",      "-6.33"] }, \
                { "name": "Talgarth",        "centre": ["51.979558", "-3.206081"] }, \
                { "name": "Camphill",        "centre": ["53.305",    "-1.7291"] } \
            ] \
        }, \
        { "model": "UK12", \
            "location":[ \
                { "name": "Exeter",          "centre": ["50.7344",   "-3.4139"] }, \
                { "name": "Fairford",        "centre": ["51.682",    "-1.7900"] }, \
                { "name": "Herstmonceaux",   "centre": ["50.8833",   "0.3333"] }, \
                { "name": "Newtown",         "centre": ["52.5157",   "-3.300"] }, \
                { "name": "Cambridge",       "centre": ["52.2050",   "0.1750"] }, \
                { "name": "Nottingham",      "centre": ["52.9667",   "-1.1667"] }, \
                { "name": "Cheviots",        "centre": ["55.5",      "-2.2"] }, \
                { "name": "Callander",       "centre": ["56.2500",   "-4.2333"] }, \
                { "name": "Aboyne",       	 "centre": ["57.0833",   "-2.8333"] }, \
                { "name": "Buckingham",      "centre": ["52.0000",   "-0.9833"] }, \
                { "name": "Larkhill",        "centre": ["51.2000",   "-1.8167"] }, \
                { "name": "Leeds",           "centre": ["53.869",    "-1.650"] }, \
                { "name": "Carrickmore",     "centre": ["54.599",    "-7.049"] }, \
                { "name": "CastorBay NI",    "centre": ["54.5",      "-6.33"] }, \
                { "name": "Talgarth",        "centre": ["51.979558", "-3.206081"] }, \
                { "name": "Camphill",        "centre": ["53.305",    "-1.7291"] } \
            ] \
        }, \
        { "model": "UKGW1", \
			"notes": "These are set in the rasp.model paremters and are the locations picked up by the NCL scripts",\
            "location":[ \
                { "name": "Newtown",         	"centre": ["52.515700", "-3.300000"] }, \
                { "name": "Talgarth",        	"centre": ["51.979558", "-3.206081"] }, \
                { "name": "Llandrindod Wells",	"centre": ["52.243073", "-3.377794"] }, \
                { "name": "Long Mynd",			"centre": ["52.518539", "-2.881185"] }, \
                { "name": "Llandovery",			"centre": ["52.003997", "-3.798394"] }, \
                { "name": "Carmarthen",			"centre": ["51.856327", "-4.311904"] }, \
                { "name": "Wrexham",			"centre": ["53.045921", "-2.992631"] }, \
                { "name": "Oswestry",			"centre": ["52.859894", "-3.056608"] }, \
                { "name": "Rhyl",				"centre": ["53.320764", "-3.491858"] }, \
                { "name": "Llanrwst",			"centre": ["53.137680", "-3.795757"] }, \
                { "name": "Leominster",			"centre": ["52.227276",  "-2.743027"] }, \
                { "name": "Shrewsbury",			"centre": ["52.710329", "-2.755180"] }, \
                { "name": "Tregaron",			"centre": ["52.225312", "-3.933543"] }, \
                { "name": "Bala",				"centre": ["52.915537", "-3.601760"] }, \
                { "name": "Caernarfon",			"centre": ["53.140802", "-4.273858"] }, \
                { "name": "Merthyr Tydfil",		"centre": ["51.748580", "-3.394090"] }, \
                { "name": "Cwmstwyth",			"centre": ["52.355760", "-3.785480"] }, \
                { "name": "Llangollen",      	"centre": ["52.969248", "-3.172270"] } \
            ]\
        }, \
        { "model": "UKGM", \
            "location":[ \
                { "name": "Crainlarich",	"centre": ["56.393798", "-4.619056"] }, \
                { "name": "Aviemore",     	"centre": ["57.195138", "-3.823827"] }, \
                { "name": "Stornaway",     	"centre": ["58.194158", "-6.244860"] }, \
                { "name": "Glencoe",     	"centre": ["56.683351", "-5.102330"] }, \
                { "name": "Edinburgh",     	"centre": ["55.950737", "-3.361400"] }, \
                { "name": "Glasgow",     	"centre": ["55.869452", "-4.434950"] }, \
                { "name": "Cheviots",     	"centre": ["55.500000", "-2.200000"] }, \
                { "name": "Inverness",     	"centre": ["57.542294", "-4.049543"] }, \
                { "name": "Aboyne",     	"centre": ["57.083300", "-2.833300"] }, \
                { "name": "Lairg",     		"centre": ["58.022634", "-4.402113"] }, \
                { "name": "Lochinver",     	"centre": ["58.146197", "-5.245612"] }, \
                { "name": "Perth",     		"centre": ["56.391521", "-3.399986"] }, \
                { "name": "Lossiemouth",    "centre": ["57.710335", "-3.319169"] }, \
                { "name": "Dufftown",     	"centre": ["57.442491", "-3.129436"] }, \
                { "name": "Ullapool",     	"centre": ["57.904072", "-5.169964"] } \
            ]\
        } \
    ] \
}';

const jcGlidingSites = ' \
{ "glidingsite":  \
    [ \
        { "model": "UK2", \
            "location":[ \
				{ "name": "Seahawk Gliding Club", "centre": ["50.0966054","-5.2662555"],"location": "Culdrose Airfield| TR13 8DJ", "type": "red" }, \
				{ "name": "Dartmoor Gliding Society", "centre": ["50.588019","-4.161587"],"location": "Burnford Common| Brentor| TAVISTOCK| Devon", "type": "blue" }, \
				{ "name": "Vectis Gliding Club", "centre": ["50.6802","-1.08452"],"location": "Bembridge Airfield| Isle of White", "type": "blue" }, \
				{ "name": "Dorset Gliding Club", "centre": ["50.7127739","-2.2188448"],"location": "Eyres Field| Puddletown Road| Hyde| WAREHAM| Dorset| BH20 7NG", "type": "blue" }, \
				{ "name": "Portsmouth Naval Gliding Club", "centre": ["50.8095011","-1.2042134"],"location": "No4 Belman Hangar| MCA Daedalus| Broom Way| Gosport| Hants| PO13 9YA", "type": "red" }, \
				{ "name": "Devon & Somerset Gliding Club", "centre": ["50.8544958","-3.2610979"],"location": "North Hill Airfield| Sheldon| HONITON| Devon| EX14 4QW", "type": "blue" }, \
				{ "name": "East Sussex Gliding Club", "centre": ["50.909654","0.108018"],"location": "Kitson Field| The Broyle| RINGMER| East Sussex| BN8 5AP", "type": "blue" }, \
				{ "name": "Southdown Gliding Club", "centre": ["50.9209142","-0.4778512"],"location": "Parham Airfield| Cootham| PULBOROUGH| West Sussex| RH20 4HP", "type": "blue" }, \
				{ "name": "North Devon Gliding Club", "centre": ["50.9279973","-3.9889573"],"location": "Eaglescott Airfield| Burrington| Umberleigh|  Devon| EX37 9LH", "type": "blue" }, \
				{ "name": "Heron Gliding Club", "centre": ["51.009167","-2.637778"],"location": "RNAS Yeovilton| ILCHESTER| Somerset| BA22 8HT", "type": "red" }, \
				{ "name": "Bath Wilts & North Dorset Gliding Club", "centre": ["51.1323501","-2.2276129"],"location": "The Park| Kingston Deverill| Warminster| Wilts| BA12 7HF", "type": "blue" }, \
				{ "name": "Lasham Gliding Society", "centre": ["51.1854235","-1.0331716"],"location": "Lasham Airfield| Lasham| ALTON| Hampshire| GU34 5SS", "type": "blue" }, \
				{ "name": "Crown Services Gliding Club", "centre": ["51.18","-1.03"],"location": "Lasham Airfield| near Alton| Hampshire| GU34 5SS", "type": "blue" }, \
				{ "name": "Channel Gliding Club", "centre": ["51.176455","1.278488"],"location": "Waldershare Park| Whitfield| DOVER| Kent| CT15 5NH", "type": "blue" }, \
				{ "name": "Kent Gliding Club", "centre": ["51.2165252","0.8427873"],"location": "Squids Gate| CHALLOCK| Kent| TN25 4DR", "type": "blue" }, \
				{ "name": "Kestrel Gliding Club", "centre": ["51.2296266","-0.9410198"],"location": "RAF Odiham| Hook| Hampshire| RG29 1QT", "type": "red" }, \
				{ "name": "Mendip Gliding Club", "centre": ["51.2596349","-2.7278772"],"location": "New Road| Priddy| Wells| BA5 3BX", "type": "blue" }, \
				{ "name": "Wyvern Gliding Club", "centre": ["51.2920396","-1.7775073"],"location": "Upavon Airfield| Nr Pewsey| Wiltshire| SN9 6BE", "type": "blue" }, \
				{ "name": "Surrey Hills Gliding Club (South London Gliding Centre)", "centre": ["51.2986143","-0.0912909"],"location": "Kenley Aerodrome| Victor Beamish Ave| Caterham| Surrey| CR3 5FX", "type": "blue" }, \
				{ "name": "Bannerdown Gliding Club", "centre": ["51.3136537","-2.1109913"],"location": "Keevil Airfield| Steeple Ashton| Trowbridge| Wiltshire| BA14 6HS", "type": "red" }, \
				{ "name": "Shalbourne Soaring Society", "centre": ["51.3314957","-1.532994"],"location": "Rivar Hill Airfield| Henley| MARLBOROUGH| Wiltshire| SN8 3RJ", "type": "blue" }, \
				{ "name": "The Vale of White Horse Gliding Club", "centre": ["51.605185","-1.674836"],"location": "Sandhill Farm| Shrivenham| SWINDON| Wilts", "type": "blue" }, \
				{ "name": "Booker Gliding Club", "centre": ["51.6116667","-0.8083333"],"location": "Wycombe Air Park| Marlow| Bucks| SL7 3DR", "type": "blue" }, \
				{ "name": "Cotswold Gliding Club", "centre": ["51.7040435","-2.1280485"],"location": "The Control Tower| Aston Down Airfield| Minchinhampton| STROUD| Glos| GL6 8HR", "type": "blue" }, \
				{ "name": "Bristol & Gloucestershire Gliding Club", "centre": ["51.7156089","-2.2811499"],"location": "Nympsfield| Nr. Stonehouse| Gloucestershire| GL10 3TX", "type": "blue" }, \
				{ "name": "South Wales Gliding Club", "centre": ["51.717032","-2.849364"],"location": "The Airfield| Gwernesney| USK| Gwent", "type": "blue" }, \
				{ "name": "Vale of Neath Gliding Club", "centre": ["51.746216","-3.582058"],"location": "Rhigos Airfield| Mount Road| Cefn Rhigos| GLYNNEATH| Mid-Glamorgan", "type": "blue" }, \
				{ "name": "Upward Bound Trust Gliding Club", "centre": ["51.7763889","-0.9416667"],"location": "Aylesbury Airfield| HADDENHAM", "type": "blue" }, \
				{ "name": "RAFGSA Chilterns Gliding Centre", "centre": ["51.792024","-0.737348"],"location": "Halton| RAF Halton| Aylesbury| Bucks| HP22 5PG", "type": "red" }, \
				{ "name": "London Gliding Club", "centre": ["51.8697641","-0.5533527"],"location": "Tring Road| DUNSTABLE| Bedfordshire| LU6 2JP", "type": "blue" }, \
				{ "name": "Oxford Gliding Club", "centre": ["51.8791667","-1.2263889"],"location": "RAF Weston On The Green| BICESTER| Oxon| OX25 3TQ", "type": "blue" }, \
				{ "name": "Windrushers Gliding Club", "centre": ["51.9060504","-1.1510935"],"location": "Bicester Airfield| Buckingham Road| Bicester| Oxon", "type": "blue" }, \
				{ "name": "Oxfordshire Sportflying Ltd", "centre": ["51.9287373","-1.4255311"],"location": "Enstone Aerodrome| CHURCH ENSTONE| Oxon| OX7 4NP", "type": "blue" }, \
				{ "name": "Essex & Suffolk Gliding Club", "centre": ["51.941266","0.789042"],"location": "Wormingford Airfield| Fordham Road| Wormingford| COLCHESTER| Essex| CO6 3AQ", "type": "blue" }, \
				{ "name": "Black Mountains Gliding Club", "centre": ["51.980021","-3.2056716"],"location": "The Airfield| Talgarth| Brecon| Powys| LD3 0EJ", "type": "blue" }, \
				{ "name": "Banbury Gliding Club", "centre": ["52.0293775","-1.2061812"],"location": "Hinton in the Hedges Airfield| Steane| Brackley| Northants| NN13 5NS", "type": "blue" }, \
				{ "name": "The Motor Glider Centre", "centre": ["52.0293775","-1.2061812"],"location": "Hinton-in-the-Hedges Airfield| Steane| BRACKLEY| Northants| NN13 6LX", "type": "blue" }, \
				{ "name": "Essex Gliding Club", "centre": ["52.048488","0.558028"],"location": "Ridgewell Airfield| Ashen| SUDBURY| Suffolk| CO10 8JU", "type": "blue" }, \
				{ "name": "Shenington Gliding Club", "centre": ["52.080409","-1.461075"],"location": "Shenington Airfield| SHENINGTON| Oxon| OX15 6NY", "type": "blue" }, \
				{ "name": "Anglia Gliding Club", "centre": ["52.126945","0.957778"],"location": "Wattisham| Wattisham Airfield| Ipswich| Suffolk| IP7 7RA", "type": "blue" }, \
				{ "name": "Bidford Gliding & Flying Club", "centre": ["52.1444515","-1.8501255"],"location": "Bidford Airfield| Honeybourne Road| Bidford on Avon| Alcester| Warks| B50 4PD", "type": "blue" }, \
				{ "name": "Cambridge Gliding Centre", "centre": ["52.1657722","-0.1176421"],"location": "Gransden Lodge Airfield| Lodge Farm| Longstowe Road| Little Gransden| SANDY| Beds| SG19 3EB", "type": "blue" }, \
				{ "name": "Rattlesden Gliding Club", "centre": ["52.169650","0.873585"],"location": "Rattlesden Airfield| Hightown Green| Rattlesden| BURY St. EDMUNDS| Suffolk| IP30 0SX", "type": "blue" }, \
				{ "name": "Stratford On Avon Gliding Club", "centre": ["52.235501","-1.709619"],"location": "Snitterfield Airfield| Bearley Road| Snitterfield| STRATFORD-ON-AVON| Warks| CV37 0EG", "type": "blue" }, \
				{ "name": "The Gliding Centre", "centre": ["52.2437561","-2.8786517"],"location": "Shobdon Airfield| Herefordshire| HR6 9NR", "type": "blue" }, \
				{ "name": "Sackville Vintage Gliding Club", "centre": ["52.2622062","-0.4745786"],"location": "Sackville Lodge Farm| Riseley| Bedfordshire| MK44 1BS", "type": "blue" }, \
				{ "name": "Welland Gliding Club", "centre": ["52.278859","-0.348074"],"location": "Lyveden Airfield| Harley Way| Lyveden Road| Brigstock| KETTERING| Northants", "type": "blue" }, \
				{ "name": "Nene Valley Gliding Club", "centre": ["52.4288233","-0.1276499"],"location": "Marshals Paddock| Ramsey Road| Upwood| Cambs| PE26 2PH", "type": "blue" }, \
				{ "name": "Norfolk Gliding Club", "centre": ["52.4572058","1.161235"],"location": "Tibenham Airfield| LONG STRATTON| Norfolk| NR16 1NT", "type": "blue" }, \
				{ "name": "Midland Gliding Club", "centre": ["52.5","-2.8333333"],"location": "The Long Mynd| CHURCH STRETTON| Shropshire| SY6 6TA", "type": "blue" }, \
				{ "name": "Four Counties Gliding Club", "centre": ["52.61382","-0.4493292"],"location": "RAF Wittering| Peterborough| PE8 6HB", "type": "red" }, \
				{ "name": "Wrekin Gliding Club", "centre": ["52.6461849","-2.2986433"],"location": "DCAE Cosford| Wolverhampton| West Midlands| WV7 3EX", "type": "red" }, \
				{ "name": "Fenland Gliding Club", "centre": ["52.6579168","0.5433083"],"location": "RAF Marham| Kings Lynn| Norfolk| PE33 9NP", "type": "red" }, \
				{ "name": "Peterborough and Spalding Gliding Club", "centre": ["52.711651","-0.135312"],"location": "Postland Airfield| CROWLAND| Lincolnshire| PE6 0JW", "type": "blue" }, \
				{ "name": "Needwood Forest Gliding Club", "centre": ["52.80027","-1.8119469"],"location": "Cross Hayes Field| Maker Lane| Hoar Cross| BURTON ON TRENT| Staffordshire| DE13 8QR", "type": "blue" }, \
				{ "name": "Buckminster Gliding Club", "centre": ["52.8253169","-0.7043326"],"location": "Saltby Airfield| Sproxton Road| Skillington| Grantham| Lincs| NG33 5HL", "type": "blue" }, \
				{ "name": "Staffordshire Gliding Club", "centre": ["52.83091","-2.2047"],"location": "Seighford Airfield| Seighford| STAFFORD| Staffs", "type": "blue" }, \
				{ "name": "Shropshire Soaring Group", "centre": ["52.83889","-2.818952"],"location": "Sleap Airfield| WEM| Shropshire| SY4 3HE", "type": "blue" }, \
				{ "name": "Cranwell Gliding Club", "centre": ["53.029724","-0.4825"],"location": "RAF Cranwell| Sleaford| Lincolnshire| NG34 8HB", "type": "red" }, \
				{ "name": "North Wales Gliding Club", "centre": ["53.046244","-3.219187"],"location": "Llantisilio Airfield| Gefnffordd Lane", "type": "blue" }, \
				{ "name": "Denbigh Gliding", "centre": ["53.2088333","-3.3943492"],"location": "The Airfield| Lleweni| Mold Road| Denbigh| LL16 4BN", "type": "blue" }, \
				{ "name": "Darlton Gliding Club", "centre": ["53.2476728","-0.851636"],"location": "Tuxford Road| Darlton| Newark| Nottinghamshire| NG22 0TQ", "type": "blue" }, \
				{ "name": "Derbyshire & Lancashire Gliding Club", "centre": ["53.3035429","-1.7280393"],"location": "Camphill| Great Hucklow| Tideswell| Derbyshire| SK17 8RQ", "type": "blue" }, \
				{ "name": "Lincolnshire Gliding Club", "centre": ["53.31461","0.18249"],"location": "Strubby Airfield| ALFORD| Lincolnshire| LN13 1AA", "type": "blue" }, \
				{ "name": "Trent Valley Gliding Club", "centre": ["53.459949","-0.583477"],"location": "The Airfield| Kirton in Lindsey| GAINSBOROUGH| Lincs", "type": "blue" }, \
				{ "name": "Burn Gliding Club", "centre": ["53.7500263","-1.0997123"],"location": "The Airfield| Park Lane| Burn| Selby| YO8 8LW", "type": "blue" }, \
				{ "name": "Bowland Forest Gliding Club", "centre": ["53.8861276","-2.6199556"],"location": "Chipping| Lower Cock Hill Farm| Fiddlers Lane| Chipping| Preston| PR3 2WN", "type": "blue" }, \
				{ "name": "Wolds Gliding Club", "centre": ["53.9337458","-0.7861311"],"location": "The Airfield| Pocklington| YORK| East Yorkshire| YO42 1NP", "type": "blue" }, \
				{ "name": "York Gliding Centre", "centre": ["53.94829","-1.185575"],"location": "Rufforth Aerodrome| Rufforth| YORK| Yorkshire| YO23 3NA", "type": "blue" }, \
				{ "name": "Lakes Gliding Club", "centre": ["54.1287985","-3.2635054"],"location": "Walney Airfield| BARROW-IN-FURNESS| Cumbria| LA14 3YJ", "type": "blue" }, \
				{ "name": "Yorkshire Gliding Club", "centre": ["54.2378783","-1.2158697"],"location": "Sutton Bank| THIRSK| North Yorkshire| YO7 2EY", "type": "blue" }, \
				{ "name": "Andreas Gliding Club", "centre": ["54.366033","-4.437962"],"location": "Andreas Airfield| Braust Farm| Lezayre| Isle of Man", "type": "blue" }, \
				{ "name": "Edensoaring", "centre": ["54.6880985","-2.5913246"],"location": "Skelling Farm| Skirwith| near penrith| CA10 1RL", "type": "blue" }, \
				{ "name": "Northumbria Gliding Club", "centre": ["54.9300895","-1.8433564"],"location": "Currock Hill| Chopwell| NEWCASTLE-UPON-TYNE| NE17 7AX", "type": "blue" }, \
				{ "name": "Dumfries & District Gliding Club", "centre": ["54.943901","-3.765231"],"location": "Fulgunzeon By Dalbeattie| Dumfries & Galloway", "type": "blue" }, \
				{ "name": "Ulster Gliding Club", "centre": ["55.07699137","-6.58188484"],"location": "Bellarena| Seacoast Road| LIMAVADY| Co. Londonderry", "type": "blue" }, \
				{ "name": "Borders Gliding Club", "centre": ["55.5894108","-2.0844259"],"location": "The Airfield| MilfieldWooler| Northumberland| NE71 6HD", "type": "blue" }, \
				{ "name": "Scottish Gliding Centre", "centre": ["56.1890376","-3.3218315"],"location": "Portmoak Airfield| Scotlandwell by KINROSS| KY13 9JJ", "type": "blue" }, \
				{ "name": "Connel Gliding Club", "centre": ["56.454896","-5.391013"],"location": "North Connel Airfield| OBAN| Argyll", "type": "blue" }, \
				{ "name": "Angus Gliding Club", "centre": ["56.643558","-2.889062"],"location": "Drumshade| Drumshade Farm| Roundyhill| Glamis| By Forfar", "type": "blue" }, \
				{ "name": "Deeside Gliding Club", "centre": ["57.0721958","-2.8399472"],"location": "Aboyne Airfield| Dinnet| ABOYNE| Aberdeenshire| AB34 5LB", "type": "blue" }, \
				{ "name": "Cairngorm Gliding Club", "centre": ["57.111826","-3.889611"],"location": "Blackmill Airstrip| Feshiebridge| KINCRAIG| Inverness-Shire", "type": "blue" }, \
				{ "name": "Bicester Gliding Club", "centre": ["52.1375","-1.7525"],"location": "GlideSport UK| Long Marston Airfield| Campden Road| Stratford upon Avon| Warks| CV37 8LL", "type": "blue" }, \
				{ "name": "Highland Gliding Club", "centre": ["57.5869","-3.321302"],"location": "Easterton| Easterton Airfield| Birnie| ELGIN| Morayshire", "type": "blue" }, \
				{ "name": "Fulmar Gliding Club", "centre": ["57.649445","-3.560555"],"location": "RAF Kinloss| Forres| Morayshire| Scotland| IV36 3UH", "type": "red" } \
				] \
        },		\
        { "model": "UKGM", \
            "location":[ \
				{ "name": "Borders Gliding Club", "centre": ["55.5894108","-2.0844259"],"location": "The Airfield| MilfieldWooler| Northumberland| NE71 6HD", "type": "blue" }, \
				{ "name": "Dumfries & District Gliding Club", "centre": ["54.943901","-3.765231"],"location": "Fulgunzeon By Dalbeattie| Dumfries & Galloway", "type": "blue" }, \
				{ "name": "Scottish Gliding Centre", "centre": ["56.1890376","-3.3218315"],"location": "Portmoak Airfield| Scotlandwell by KINROSS| KY13 9JJ", "type": "blue" }, \
				{ "name": "Connel Gliding Club", "centre": ["56.454896","-5.391013"],"location": "North Connel Airfield| OBAN| Argyll", "type": "blue" }, \
				{ "name": "Angus Gliding Club", "centre": ["56.643558","-2.889062"],"location": "Drumshade| Drumshade Farm| Roundyhill| Glamis| By Forfar", "type": "blue" }, \
				{ "name": "Deeside Gliding Club", "centre": ["57.0721958","-2.8399472"],"location": "Aboyne Airfield| Dinnet| ABOYNE| Aberdeenshire| AB34 5LB", "type": "blue" }, \
				{ "name": "Cairngorm Gliding Club", "centre": ["57.111826","-3.889611"],"location": "Blackmill Airstrip| Feshiebridge| KINCRAIG| Inverness-Shire", "type": "blue" }, \
				{ "name": "Highland Gliding Club", "centre": ["57.5869","-3.321302"],"location": "Easterton| Easterton Airfield| Birnie| ELGIN| Morayshire", "type": "blue" }, \
				{ "name": "Fulmar Gliding Club", "centre": ["57.649445","-3.560555"],"location": "RAF Kinloss| Forres| Morayshire| Scotland| IV36 3UH", "type": "red" } \
				] \
        }, \
        { "model": "UKGW1", \
            "location":[ \
				{ "name": "South Wales Gliding Club", "centre": ["51.717032","-2.849364"],"location": "The Airfield| Gwernesney| USK| Gwent", "type": "blue" }, \
				{ "name": "Vale of Neath Gliding Club", "centre": ["51.746216","-3.582058"],"location": "Rhigos Airfield| Mount Road| Cefn Rhigos| GLYNNEATH| Mid-Glamorgan", "type": "blue" }, \
				{ "name": "Black Mountains Gliding Club", "centre": ["51.980021","-3.2056716"],"location": "The Airfield| Talgarth| Brecon| Powys| LD3 0EJ", "type": "blue" }, \
				{ "name": "Shropshire Soaring Group", "centre": ["52.83889","-2.818952"],"location": "Sleap Airfield| WEM| Shropshire| SY4 3HE", "type": "blue" }, \
				{ "name": "The Gliding Centre", "centre": ["52.2437561","-2.8786517"],"location": "Shobdon Airfield| Herefordshire| HR6 9NR", "type": "blue" }, \
				{ "name": "Midland Gliding Club", "centre": ["52.5","-2.8333333"],"location": "The Long Mynd| CHURCH STRETTON| Shropshire| SY6 6TA", "type": "blue" }, \
				{ "name": "North Wales Gliding Club", "centre": ["53.046244","-3.219187"],"location": "Llantisilio Airfield| Gefnffordd Lane", "type": "blue" }, \
				{ "name": "Denbigh Gliding", "centre": ["53.2088333","-3.3943492"],"location": "The Airfield| Lleweni| Mold Road| Denbigh| LL16 4BN", "type": "blue" } \
				] \
        } \
	] \
}';
const scDefaultSoundingPopupSize = "530"; // this is for the popup sounding graphic size - trade off on size and readibility -> try and tune

const scDefaultModel = "UK2";           // default model to start on
const scDefaultParameter = "wstar";     // which paramter was start on
const scDefaultParameterTime = "1300";  // which hour we start on
const icMapHeight = 600;
const icMapWidth = 600;
const scWaterMarkLocation = 'topleft';   // Watermark -> OSM options= bottomleft, bottomright, topleft, topright
const scZoomLocation = 'bottomleft';     // Zoom control -> OSM options= bottomleft, bottomright, topleft, topright
const scScaleLocation = 'topright';      // Scale control -> OSM options= bottomleft, bottomright, topleft, topright
const scOpacityLocation = 'bottomright'; // Opaticy control -> OSM options= bottomleft, bottomright, topleft, topright 
const bAirSpaceEnabled = true;


const sForecastServerRoot = "http://rasp.mrsap.org";   // this is where all your data is
const scWatermarkLogoLocation = "water-mark-logo.png"; // put your watermark logo here

const scAttribution = '| &copy; <a href="https://www/openmaptiles.org">OpenMapTiles</a>'; // Attribution - important!
const scAttributionOSM = 'http://mrsap.org:81/styles/osm-bright/{z}/{x}/{y}.png';         // Attribution - important!

const scMRSAPAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a></a>';
const scMRSAPURL = 'http://mrsap.org:81/{z}/{x}/{y}.png'; // This is the fille tile URL - get this right!

const icDefaultZoom = 6; // default zoom - can be overriden in the model above

// These stings define where your header, body and scales come from. If your folder sturcture is different, change it here
//  ... exmaple here is <server root>/<model>/FCST/<png files>
var scScalePanelDefault = sForecastServerRoot + "/"+scDefaultModel+"/FCST/"+scDefaultParameter +".curr."+scDefaultParameterTime +"lst.d2.side.png";
var scTitlePanelDefault = sForecastServerRoot + "/"+scDefaultModel+"/FCST/"+scDefaultParameter +".curr."+scDefaultParameterTime +"lst.d2.head.png";
