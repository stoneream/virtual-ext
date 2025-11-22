{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 9,
			"minor" : 0,
			"revision" : 8,
			"architecture" : "x64",
			"modernui" : 1
		}
,
		"classnamespace" : "box",
		"rect" : [ 116.0, 233.0, 1333.0, 985.0 ],
		"openinpresentation" : 1,
		"gridsize" : [ 15.0, 15.0 ],
		"boxes" : [ 			{
				"box" : 				{
					"id" : "obj-4",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 225.0, 82.0, 69.0, 22.0 ],
					"text" : "expr #1 + 1"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-19",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1846.341507434844971, 457.0, 147.0, 22.0 ],
					"text" : "sprintf index %d name %s"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-18",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1460.975644588470459, 457.0, 147.0, 22.0 ],
					"text" : "sprintf index %d name %s"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-13",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1080.0, 462.0, 147.0, 22.0 ],
					"text" : "sprintf index %d name %s"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-9",
					"ignoreclick" : 1,
					"maxclass" : "live.numbox",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "float" ],
					"parameter_enable" : 1,
					"patching_rect" : [ 225.0, 136.0, 44.0, 15.0 ],
					"presentation" : 1,
					"presentation_rect" : [ -0.833333313465118, 135.833330094814301, 145.365854740142822, 15.0 ],
					"saved_attribute_attributes" : 					{
						"valueof" : 						{
							"parameter_enum" : [ "0", "1" ],
							"parameter_initial" : [ "#1" ],
							"parameter_initial_enable" : 1,
							"parameter_invisible" : 2,
							"parameter_longname" : "live.numbox",
							"parameter_mmin" : 1.0,
							"parameter_modmode" : 4,
							"parameter_shortname" : "live.numbox",
							"parameter_type" : 1
						}

					}
,
					"varname" : "live.numbox"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-15",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1680.0, 45.0, 202.0, 22.0 ],
					"text" : "knob_umenu_all_msg append apple"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-14",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1455.0, 45.0, 213.0, 22.0 ],
					"text" : "knob_umenu_all_msg append banana"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-12",
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 1290.0, 15.0, 150.0, 20.0 ],
					"text" : "debug patch"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-6",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1287.5, 45.0, 155.0, 22.0 ],
					"text" : "knob_umenu_all_msg clear"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-3",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 16.0, 706.0, 215.0, 22.0 ],
					"text" : "prepend knob_master_bus_notification"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-39",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"patching_rect" : [ 225.0, 15.0, 58.0, 22.0 ],
					"text" : "loadbang"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-87",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 135.0, 65.962962079048168, 29.5, 22.0 ],
					"text" : "#1"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-86",
					"linecount" : 3,
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 505.921047806739807, 732.894729852676392, 150.0, 50.0 ],
					"text" : "prependのパターンが同じで\n改良の余地があるが\n一旦放置..."
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-84",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1848.487830638885498, 528.0, 342.0, 22.0 ],
					"text" : "prepend knob_umenu  knob_group #1 knob_umenu_number 3"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-83",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1462.487830638885498, 528.0, 342.0, 22.0 ],
					"text" : "prepend knob_umenu  knob_group #1 knob_umenu_number 1"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-61",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1080.487830638885498, 528.0, 339.0, 22.0 ],
					"text" : "prepend knob_umenu knob_group #1 knob_umenu_number 0"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-54",
					"items" : [ "<none>", ",", "Device On", ",", "Macro 1", ",", "Macro 2", ",", "Macro 3", ",", "Macro 4", ",", "Macro 5", ",", "Macro 6", ",", "Macro 7", ",", "Macro 8", ",", "Macro 9", ",", "Macro 10", ",", "Macro 11", ",", "Macro 12", ",", "Macro 13", ",", "Macro 14", ",", "Macro 15", ",", "Macro 16", ",", "Chain Selector" ],
					"maxclass" : "umenu",
					"numinlets" : 1,
					"numoutlets" : 3,
					"outlettype" : [ "int", "", "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 1846.341507434844971, 378.414642810821533, 100.0, 22.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 45.365854740142822, 98.048782825469971, 100.0, 22.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-52",
					"items" : [ "<none>", ",", "Device On", ",", "Macro 1", ",", "Macro 2", ",", "Macro 3", ",", "Macro 4", ",", "Macro 5", ",", "Macro 6", ",", "Macro 7", ",", "Macro 8", ",", "Macro 9", ",", "Macro 10", ",", "Macro 11", ",", "Macro 12", ",", "Macro 13", ",", "Macro 14", ",", "Macro 15", ",", "Macro 16", ",", "Chain Selector" ],
					"maxclass" : "umenu",
					"numinlets" : 1,
					"numoutlets" : 3,
					"outlettype" : [ "int", "", "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 1460.975644588470459, 378.414642810821533, 100.0, 22.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 45.365854740142822, 52.195123195648193, 100.0, 22.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-51",
					"items" : [ "<none>", ",", "Device On", ",", "Macro 1", ",", "Macro 2", ",", "Macro 3", ",", "Macro 4", ",", "Macro 5", ",", "Macro 6", ",", "Macro 7", ",", "Macro 8", ",", "Macro 9", ",", "Macro 10", ",", "Macro 11", ",", "Macro 12", ",", "Macro 13", ",", "Macro 14", ",", "Macro 15", ",", "Macro 16", ",", "Chain Selector" ],
					"maxclass" : "umenu",
					"numinlets" : 1,
					"numoutlets" : 3,
					"outlettype" : [ "int", "", "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 1080.487830638885498, 378.414642810821533, 100.0, 22.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 45.365854740142822, 7.317073345184326, 100.0, 22.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-50",
					"maxclass" : "newobj",
					"numinlets" : 5,
					"numoutlets" : 5,
					"outlettype" : [ "", "", "", "", "" ],
					"patching_rect" : [ 1079.26831841468811, 248.78049373626709, 1139.853676795959473, 22.0 ],
					"text" : "route knob1_umenu_msg knob2_umenu_msg knob3_umenu_msg knob_umenu_all_msg"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-33",
					"maxclass" : "newobj",
					"numinlets" : 5,
					"numoutlets" : 5,
					"outlettype" : [ "", "", "", "", "" ],
					"patching_rect" : [ 14.0, 249.0, 749.277589321136475, 22.0 ],
					"text" : "route knob1_dial_value knob2_dial_value knob3_dial_value knob_all_dial_value"
				}

			}
, 			{
				"box" : 				{
					"fontsize" : 12.0,
					"id" : "obj-31",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 2,
					"outlettype" : [ "", "" ],
					"patching_rect" : [ 15.5, 116.925924158096308, 103.148150503635406, 22.0 ],
					"text" : "route #1"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-25",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 2,
					"outlettype" : [ "", "" ],
					"patching_rect" : [ 15.5, 65.962962079048154, 103.0, 22.0 ],
					"text" : "route knob_group"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-10",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 16.0, 746.0, 197.0, 22.0 ],
					"text" : "send knob_master_bus_notification"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-5",
					"maxclass" : "newobj",
					"numinlets" : 0,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 15.5, 15.0, 146.0, 22.0 ],
					"text" : "receive knob_master_bus"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-11",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 724.390261173248291, 426.829278469085693, 338.0, 22.0 ],
					"text" : "prepend knob_dial  knob_group #1 knob_dial_number 2 value"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-8",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 360.975618362426758, 426.829278469085693, 338.0, 22.0 ],
					"text" : "prepend knob_dial  knob_group #1 knob_dial_number 1 value"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-1",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 16.0, 427.0, 335.0, 22.0 ],
					"text" : "prepend knob_dial knob_group #1 knob_dial_number 0 value"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-44",
					"maxclass" : "live.dial",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "float" ],
					"parameter_enable" : 1,
					"patching_rect" : [ 724.390261173248291, 363.414642810821533, 27.0, 37.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 0.0, 90.0, 27.0, 37.0 ],
					"saved_attribute_attributes" : 					{
						"valueof" : 						{
							"parameter_initial" : [ 0.0 ],
							"parameter_longname" : "live.dial[3]",
							"parameter_modmode" : 4,
							"parameter_shortname" : "live.dial",
							"parameter_type" : 1,
							"parameter_unitstyle" : 0
						}

					}
,
					"showname" : 0,
					"varname" : "live.dial"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-36",
					"maxclass" : "live.dial",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "float" ],
					"parameter_enable" : 1,
					"patching_rect" : [ 360.975618362426758, 363.0, 27.0, 37.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 0.0, 45.0, 27.0, 37.0 ],
					"saved_attribute_attributes" : 					{
						"valueof" : 						{
							"parameter_initial" : [ 0.0 ],
							"parameter_longname" : "live.dial[1]",
							"parameter_modmode" : 4,
							"parameter_shortname" : "live.dial",
							"parameter_type" : 1,
							"parameter_unitstyle" : 0
						}

					}
,
					"showname" : 0,
					"varname" : "live.dial[1]"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-21",
					"maxclass" : "live.dial",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "float" ],
					"parameter_enable" : 1,
					"patching_rect" : [ 16.0, 363.0, 27.0, 37.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 0.0, 0.0, 27.0, 37.0 ],
					"saved_attribute_attributes" : 					{
						"valueof" : 						{
							"parameter_initial" : [ 0.0 ],
							"parameter_longname" : "live.dial[2]",
							"parameter_modmode" : 4,
							"parameter_shortname" : "live.dial",
							"parameter_type" : 1,
							"parameter_unitstyle" : 0
						}

					}
,
					"showname" : 0,
					"varname" : "live.dial[2]"
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"color" : [ 0.811764705882353, 0.372549019607843, 0.372549019607843, 1.0 ],
					"destination" : [ "obj-3", 0 ],
					"midpoints" : [ 25.5, 517.399144500494003, 25.5, 517.399144500494003 ],
					"source" : [ "obj-1", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"color" : [ 0.811764705882353, 0.372549019607843, 0.372549019607843, 1.0 ],
					"destination" : [ "obj-3", 0 ],
					"midpoints" : [ 733.890261173248291, 501.102848738431931, 25.5, 501.102848738431931 ],
					"source" : [ "obj-11", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-61", 0 ],
					"source" : [ "obj-13", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-50", 0 ],
					"midpoints" : [ 1464.5, 164.597017407417297, 1088.76831841468811, 164.597017407417297 ],
					"source" : [ "obj-14", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-50", 0 ],
					"midpoints" : [ 1689.5, 190.716419458389282, 1088.76831841468811, 190.716419458389282 ],
					"source" : [ "obj-15", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-83", 0 ],
					"source" : [ "obj-18", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-84", 0 ],
					"source" : [ "obj-19", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-1", 0 ],
					"midpoints" : [ 25.5, 419.954709380865097, 25.5, 419.954709380865097 ],
					"source" : [ "obj-21", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-31", 0 ],
					"midpoints" : [ 25.0, 97.0, 25.0, 97.0 ],
					"source" : [ "obj-25", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-10", 0 ],
					"source" : [ "obj-3", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-33", 0 ],
					"midpoints" : [ 25.0, 142.0, 23.5, 142.0 ],
					"order" : 1,
					"source" : [ "obj-31", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-50", 0 ],
					"midpoints" : [ 25.0, 224.012344002723694, 1088.76831841468811, 224.012344002723694 ],
					"order" : 0,
					"source" : [ "obj-31", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"color" : [ 1.0, 1.0, 1.0, 1.0 ],
					"destination" : [ "obj-21", 0 ],
					"midpoints" : [ 571.208191990852356, 300.804960250854492, 25.5, 300.804960250854492 ],
					"order" : 2,
					"source" : [ "obj-33", 3 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-21", 0 ],
					"midpoints" : [ 23.5, 275.02778414487841, 25.5, 275.02778414487841 ],
					"source" : [ "obj-33", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"color" : [ 1.0, 1.0, 1.0, 1.0 ],
					"destination" : [ "obj-36", 0 ],
					"midpoints" : [ 571.208191990852356, 324.461873769760132, 370.475618362426758, 324.461873769760132 ],
					"order" : 1,
					"source" : [ "obj-33", 3 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-36", 0 ],
					"midpoints" : [ 206.069397330284119, 324.410500383377098, 370.475618362426758, 324.410500383377098 ],
					"source" : [ "obj-33", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"color" : [ 1.0, 1.0, 1.0, 1.0 ],
					"destination" : [ "obj-44", 0 ],
					"midpoints" : [ 571.208191990852356, 324.336390495300293, 733.890261173248291, 324.336390495300293 ],
					"order" : 0,
					"source" : [ "obj-33", 3 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-44", 0 ],
					"midpoints" : [ 388.638794660568237, 340.459886050224327, 733.890261173248291, 340.459886050224327 ],
					"source" : [ "obj-33", 2 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-8", 0 ],
					"midpoints" : [ 370.475618362426758, 419.954709380865097, 370.475618362426758, 419.954709380865097 ],
					"source" : [ "obj-36", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 0 ],
					"source" : [ "obj-39", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-9", 0 ],
					"source" : [ "obj-4", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-11", 0 ],
					"midpoints" : [ 733.890261173248291, 408.843598634004593, 733.890261173248291, 408.843598634004593 ],
					"source" : [ "obj-44", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-25", 0 ],
					"midpoints" : [ 25.0, 50.5, 25.0, 50.5 ],
					"source" : [ "obj-5", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"color" : [ 1.0, 1.0, 1.0, 1.0 ],
					"destination" : [ "obj-51", 0 ],
					"midpoints" : [ 1929.408576011657715, 291.962960004806519, 1089.987830638885498, 291.962960004806519 ],
					"order" : 2,
					"source" : [ "obj-50", 3 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-51", 0 ],
					"source" : [ "obj-50", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"color" : [ 1.0, 1.0, 1.0, 1.0 ],
					"destination" : [ "obj-52", 0 ],
					"midpoints" : [ 1929.408576011657715, 320.185184001922607, 1470.475644588470459, 320.185184001922607 ],
					"order" : 1,
					"source" : [ "obj-50", 3 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-52", 0 ],
					"midpoints" : [ 1368.981737613677979, 320.185184001922607, 1470.475644588470459, 320.185184001922607 ],
					"source" : [ "obj-50", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"color" : [ 1.0, 1.0, 1.0, 1.0 ],
					"destination" : [ "obj-54", 0 ],
					"midpoints" : [ 1929.408576011657715, 350.234567999839783, 1855.841507434844971, 350.234567999839783 ],
					"order" : 0,
					"source" : [ "obj-50", 3 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-54", 0 ],
					"midpoints" : [ 1649.195156812667847, 349.780487775802612, 1855.841507434844971, 349.780487775802612 ],
					"source" : [ "obj-50", 2 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-13", 1 ],
					"source" : [ "obj-51", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-13", 0 ],
					"source" : [ "obj-51", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-18", 1 ],
					"source" : [ "obj-52", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-18", 0 ],
					"source" : [ "obj-52", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-19", 1 ],
					"source" : [ "obj-54", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-19", 0 ],
					"source" : [ "obj-54", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-50", 0 ],
					"midpoints" : [ 1297.0, 128.029854536056519, 1088.76831841468811, 128.029854536056519 ],
					"source" : [ "obj-6", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"color" : [ 0.945098039215686, 0.913725490196078, 0.407843137254902, 1.0 ],
					"destination" : [ "obj-3", 0 ],
					"midpoints" : [ 1089.987830638885498, 575.966105043888092, 25.5, 575.966105043888092 ],
					"source" : [ "obj-61", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"color" : [ 0.811764705882353, 0.372549019607843, 0.372549019607843, 1.0 ],
					"destination" : [ "obj-3", 0 ],
					"midpoints" : [ 370.475618362426758, 469.991738647222519, 25.5, 469.991738647222519 ],
					"source" : [ "obj-8", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"color" : [ 0.945098039215686, 0.913725490196078, 0.407843137254902, 1.0 ],
					"destination" : [ "obj-3", 0 ],
					"midpoints" : [ 1471.987830638885498, 599.711866140365601, 25.5, 599.711866140365601 ],
					"source" : [ "obj-83", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"color" : [ 0.945098039215686, 0.913725490196078, 0.407843137254902, 1.0 ],
					"destination" : [ "obj-3", 0 ],
					"midpoints" : [ 1857.987830638885498, 627.983051359653473, 25.5, 627.983051359653473 ],
					"source" : [ "obj-84", 0 ]
				}

			}
 ],
		"default_bgcolor" : [ 0.741176470588235, 0.741176470588235, 0.741176470588235, 1.0 ],
		"stripecolor" : [ 0.870588235294118, 0.870588235294118, 0.870588235294118, 1.0 ],
		"saved_attribute_attributes" : 		{
			"default_plcolor" : 			{
				"expression" : ""
			}

		}
,
		"oscreceiveudpport" : 0
	}

}
