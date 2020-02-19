conn = new Mongo();
//conn = new Mongo( "127.0.0.1", 27018 );
db = conn.getDB("Takeup");


db.ResVista.replaceOne({"_CLOK": "ALL","HID": "VISTA_5181_20200131"},{
	"HID": "VISTA_5181_20200131",
	"CLIENTE": "ALL",
	"_CLOK": "ALL",
	"NOME": "Vista Standard lista Societa Subappaltatrici",
    "TARGET": "RICERCAGENERICA",
    "PANNELLO":"NO",
	"LISTACAMPI": [ 
		{
			"CAMPO": "ACTIONS",
			"DESCRIZIONE": "Azioni",			
			"CLASSE": "socsub_azioni",
			"VISIBILITY": "visible",
            "DISPLAY": "ACTIONS",
            "PANNELLO":"NO",
			"DISPLAY_CAPITOLO": "TDNOTEDITHTML",
			"ACTIONS":[{
                "ICON":"mdi mdi-plus-circle-outline",
                "ISI":"S",
                "ACTION":"caricaOggetto",
				"TITLE":"caricaOggetto"
            }/* {
				"ICON":"fa fa-edit ",
				"ISI":"S",
				"ACTION":"assegnaSocietaSub",
				"TITLE":"Assegna la Societa' Subappaltatrice"
			}, *//* {
				"ICON":"fa fa-plus ",
				"ISI":"S",
				"ACTION":"addSocAtt",
				"TITLE":"Assegna la Societa' Subappaltatrice all'Attivita'"
			} */],	

			"DISPLAYH": "ACTIONSTH",
			"ACTIONSTH": [/*{
				"ICON":"fa fa-plus fa-2x",
				"ISI":"S",
				"ACTION":"addSocAtt",
				"TITLE":"Assegna la Societa' Subappaltatrice all'Attivita'"
			}*/]		
		},
		{
			"CAMPO": "DESCRIZIONE",
			"DESCRIZIONE": "Descrizione",
			"CLASSE": "socsub_codice",
			"VISIBILITY": "visible",
			"DISPLAY": "TDNOTEDIT"
		},{
			"CAMPO": "OBJECT.object.type",
			"DESCRIZIONE": "Tipo Oggetto",
			"CLASSE": "socsub_denominazione",
			"VISIBILITY": "visible",
			"DISPLAY": "TDNOTEDIT"
		}

		
	]
}, {upsert: true});