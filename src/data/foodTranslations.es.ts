import type { AgeRange } from '@/types/food';

export type FoodTranslation = {
	name: string;
	preparationByAge: Partial<Record<AgeRange, string>>;
	chokingHazardWarning?: string;
};

export const FOOD_TRANSLATIONS_ES: Record<string, FoodTranslation> = {
	almond: {
		name: 'Almendra',
		preparationByAge: {
			'6-9': 'Nunca entera. Mezcla mantequilla de almendra suave con leche materna, fórmula o agua tibia para diluirla.',
			'9-12': 'Unta mantequilla de almendra suave en tiras de pan tostado, en una capa muy fina.'
		},
		chokingHazardWarning:
			'Las almendras enteras, los trozos de nuez o las cantidades espesas de mantequilla de almendra son riesgos graves de asfixia.'
	},
	amaranth: {
		name: 'Amaranto',
		preparationByAge: {
			'6-9': 'Cocido hasta formar un puré espeso que se pega fácilmente a la cuchara.',
			'9-12': 'Puré cocido o mezclado en hamburguesas suaves de verduras.'
		}
	},
	apple: {
		name: 'Manzana',
		preparationByAge: {
			'6-9': 'Estrictamente al vapor o al horno hasta que esté completamente blanda al tenedor. Nunca cruda.',
			'9-12': 'Rallada cruda o cocida hasta que esté completamente blanda.'
		},
		chokingHazardWarning: 'Los trozos de manzana cruda o duros son un riesgo de asfixia grave y alto.'
	},
	apricot: {
		name: 'Albaricoque',
		preparationByAge: {
			'6-9': 'Muy maduro y blando, cortado en gajos gruesos.',
			'9-12': 'Cortado en cubos pequeños. No ofrezcas albaricoques secos todavía.'
		},
		chokingHazardWarning:
			'Los albaricoques secos son demasiado duros y difíciles de masticar, lo que los convierte en un riesgo serio de asfixia.'
	},
	asparagus: {
		name: 'Espárrago',
		preparationByAge: {
			'6-9': 'Al vapor o asado hasta que esté muy blando, sirviendo la parte gruesa de la punta para que el bebé lo sostenga.',
			'9-12': 'Cocido hasta que esté completamente blando y cortado en trozos pequeños del tamaño de un bocado.'
		}
	},
	avocado: {
		name: 'Aguacate',
		preparationByAge: {
			'6-9': 'Tiras maduras del tamaño del dedo meñique de un adulto. Se puede rebozar en cereal triturado para mejor agarre.',
			'9-12': 'Cubos pequeños en dados para practicar el agarre en pinza.'
		}
	},
	banana: {
		name: 'Plátano',
		preparationByAge: {
			'6-9': 'Pela hasta la mitad para que el bebé pueda sostener la base. O corta en tiras verticales largas.',
			'9-12': 'Cortado en trozos pequeños del tamaño de un bocado o en rodajas.'
		},
		chokingHazardWarning: 'Los trozos muy grandes y gruesos pueden pegarse al paladar.'
	},
	barley: {
		name: 'Cebada',
		preparationByAge: {
			'6-9': 'Cocida completamente hasta que esté muy blanda, ligeramente machacada o servida como un puré espeso.',
			'9-12': 'Cocida hasta que esté muy blanda, servida en granos sueltos para practicar el agarre en pinza.'
		}
	},
	beef: {
		name: 'Carne de Res',
		preparationByAge: {
			'6-9':
				'Sirve una tira gruesa de bistec bien cocido (del tamaño de dos dedos de un adulto) para chupar. O mezcla carne molida en una albóndiga suave.',
			'9-12': 'Carne de res finamente deshebrada o trocitos pequeños de carne molida suave.'
		},
		chokingHazardWarning: 'Evita los trozos pequeños, secos o con grasa/nervios de carne.'
	},
	'beef-liver': {
		name: 'Hígado de Res',
		preparationByAge: {
			'6-9': 'Cocido completamente y hecho puré, o cortado en una pasta suave para untar en tiras de pan tostado.',
			'9-12': 'Cocido hasta que esté blando y finamente picado en trozos diminutos.'
		}
	},
	'bell-pepper': {
		name: 'Pimiento',
		preparationByAge: {
			'6-9': 'Asado o al vapor hasta que esté muy blando, cortado en tiras anchas.',
			'9-12': 'Cocido hasta que esté muy blando y finamente picado en cubos.'
		},
		chokingHazardWarning: 'El pimiento crudo es demasiado duro y es un riesgo de asfixia.'
	},
	'black-beans': {
		name: 'Frijoles Negros',
		preparationByAge: {
			'6-9': 'Cocidos hasta que estén muy blandos y machacados completamente hasta formar una pasta. Se pueden untar en pan tostado.',
			'9-12': 'Cocidos hasta que estén muy blandos. Aplasta cada frijol individual entre tus dedos antes de servir.'
		},
		chokingHazardWarning: 'Los frijoles enteros y redondos son un alto riesgo de asfixia. Siempre macháralos o aplástalos.'
	},
	blackberry: {
		name: 'Mora',
		preparationByAge: {
			'6-9': 'Aplastadas con un tenedor o tus dedos, o agrégalas al puré de cereal.',
			'9-12': 'Aplastadas con un tenedor o tus dedos.'
		},
		chokingHazardWarning: 'Las moras enteras son pequeñas, redondas y suficientemente firmes para bloquear las vías respiratorias.'
	},
	blueberry: {
		name: 'Arándano',
		preparationByAge: {
			'6-9': 'Aplastados con un tenedor o tus dedos, o agrégalos al puré de cereal.',
			'9-12': 'Aplastados con un tenedor o tus dedos.'
		},
		chokingHazardWarning: 'Los arándanos enteros son un riesgo de asfixia muy alto debido a su tamaño y forma redonda.'
	},
	bread: {
		name: 'Pan',
		preparationByAge: {
			'6-9': 'Ligeramente tostado para evitar que se vuelva pegajoso, cortado en tiras de unos 2 dedos de ancho.',
			'9-12': 'Ligeramente tostado, cortado en trozos pequeños del tamaño de un bocado.'
		},
		chokingHazardWarning: 'El pan fresco sin tostar puede formar una bola pegajosa en la boca y causar un riesgo de asfixia.'
	},
	broccoli: {
		name: 'Brócoli',
		preparationByAge: {
			'6-9': 'Floretes al vapor o asados con un tallo largo para que el bebé lo sostenga como un mango.',
			'9-12': 'Cortado en trozos más pequeños del tamaño de un bocado de floretes cocidos y blandos.'
		}
	},
	'brussels-sprouts': {
		name: 'Coles de Bruselas',
		preparationByAge: {
			'6-9': 'Al vapor hasta que estén completamente blandas, finamente picadas para agregar a cualquier receta.',
			'9-12': 'Al vapor hasta que estén blandas, desmenuzadas o cortadas en cuartos.'
		},
		chokingHazardWarning: 'Las coles de Bruselas enteras son un riesgo de asfixia grave.'
	},
	'butternut-squash': {
		name: 'Calabaza Butternut',
		preparationByAge: {
			'6-9': 'Asada o al vapor hasta que esté blanda, cortada en tiras del largo de un dedo.',
			'9-12': 'Asada o al vapor hasta que esté blanda, cortada en cubos pequeños.'
		}
	},
	cantaloupe: {
		name: 'Melón',
		preparationByAge: {
			'6-9': 'Muy maduro y blando, cortado en tiras rectangulares gruesas y largas.',
			'9-12': 'Muy maduro y blando, cortado en cubos pequeños del tamaño de un bocado.'
		}
	},
	carrot: {
		name: 'Zanahoria',
		preparationByAge: {
			'6-9': 'Al vapor o asada hasta que esté completamente blanda al tenedor, cortada en bastones gruesos.',
			'9-12': 'Al vapor o asada hasta que esté muy blanda, cortada en cubos pequeños.'
		},
		chokingHazardWarning: 'Las zanahorias crudas o las rodajas cocidas duras son un riesgo de asfixia muy alto.'
	},
	cashew: {
		name: 'Anacardo',
		preparationByAge: {
			'6-9': 'Nunca entero. Mantequilla de anacardo suave, diluida completamente con agua o leche materna.',
			'9-12': 'Unta mantequilla de anacardo suave en una capa muy fina sobre pan tostado o mézclala en purés.'
		},
		chokingHazardWarning: 'Los anacardos enteros o en trozos son riesgos de asfixia muy peligrosos.'
	},
	cauliflower: {
		name: 'Coliflor',
		preparationByAge: {
			'6-9': 'Al vapor hasta que esté blanda, conservando un floret grande con un tallo como mango.',
			'9-12': 'Cocida hasta que esté blanda, picada en floretes pequeños del tamaño de un bocado.'
		}
	},
	chayote: {
		name: 'Chayote',
		preparationByAge: {
			'6-9': 'Pelado, sin el centro, al vapor hasta que esté perfectamente tierno, cortado en tiras gruesas.',
			'9-12': 'Pelado, sin el centro, al vapor hasta que esté tierno, cortado en cubos pequeños.'
		}
	},
	'chia-seeds': {
		name: 'Semillas de Chía',
		preparationByAge: {
			'6-9': 'Nunca sirvas secas. Remoja completamente en agua o leche materna para hacer un pudín de chía suave.',
			'9-12': 'Remojadas en pudín o bien mezcladas en la masa de panqueques antes de cocinar.'
		}
	},
	chicken: {
		name: 'Pollo',
		preparationByAge: {
			'6-9':
				'Ofrece un muslo de pollo cocido entero con la piel, cartílago y huesos sueltos retirados. O una tira gruesa de pechuga.',
			'9-12': 'Pollo finamente deshebrado o trocitos pequeños de pollo molido suave.'
		}
	},
	chickpeas: {
		name: 'Garbanzos',
		preparationByAge: {
			'6-9': 'Cocidos hasta que estén muy blandos y servidos como albóndigas o hamburguesas.',
			'9-12': 'Cocidos hasta que estén completamente blandos, con cada garbanzo aplastado entre tus dedos.'
		},
		chokingHazardWarning: 'Los garbanzos enteros y redondos son un alto riesgo de asfixia. Siempre aplástalos o macháralos.'
	},
	coconut: {
		name: 'Coco',
		preparationByAge: {
			'6-9': 'Coco sin azúcar finamente rallado, bien mezclado en purés o alimentos suaves.',
			'9-12': 'Coco sin azúcar finamente rallado, bien mezclado en alimentos suaves.'
		},
		chokingHazardWarning: 'Los trozos de pulpa de coco dura o las hojuelas grandes son peligrosos riesgos de asfixia.'
	},
	corn: {
		name: 'Maíz',
		preparationByAge: {
			'6-9': 'Sirve una pieza grande de maíz cocido en la mazorca para que el bebé la raspe con las encías.',
			'9-12': 'No sirvas granos sueltos enteros todavía. Sirve maíz suelto solo si está machacado o en puré.'
		},
		chokingHazardWarning: 'Los granos de maíz sueltos y enteros son un alto riesgo de asfixia para bebés menores de 12 meses.'
	},
	cranberry: {
		name: 'Arándano Rojo',
		preparationByAge: {
			'6-9': 'Cocido hasta formar un puré suave y mezclado con otros alimentos. No ofrezcas arándanos rojos secos.',
			'9-12': 'Cocido y machacado completamente.'
		},
		chokingHazardWarning: 'Los arándanos rojos secos son muy masticables y representan riesgos de asfixia peligrosos.'
	},
	cucumber: {
		name: 'Pepino',
		preparationByAge: {
			'6-9': 'Pela la piel, corta en un tronco rectangular grueso (del tamaño del dedo de un adulto) para roer.',
			'9-12': 'Pepino crudo rallado, o cortado en medias lunas muy finas.'
		},
		chokingHazardWarning: 'Los trozos duros o las rodajas redondas de pepino son riesgos de asfixia peligrosos.'
	},
	dates: {
		name: 'Dátiles',
		preparationByAge: {
			'6-9':
				'Nunca enteros. Sin hueso, remojados en agua caliente hasta que estén blandos, y triturados en una pasta suave para mezclar con otros alimentos.',
			'9-12': 'Triturados en pastas o usados para endulzar productos horneados suaves.'
		},
		chokingHazardWarning: 'Los dátiles enteros son extremadamente pegajosos y duros, lo que crea un riesgo de asfixia serio.'
	},
	egg: {
		name: 'Huevo',
		preparationByAge: {
			'6-9': 'Huevo duro cortado en cuartos a lo largo o tiras de tortilla.',
			'9-12': 'Trozos revueltos o huevo duro finamente picado.'
		},
		chokingHazardWarning:
			'Asegúrate de que la clara esté completamente cocida; la yema dura y seca puede provocar arcadas si no se machaca un poco.'
	},
	eggplant: {
		name: 'Berenjena',
		preparationByAge: {
			'6-9': 'Asada o al vapor hasta que esté completamente blanda, cortada en tiras gruesas.',
			'9-12': 'Cocida hasta que esté muy blanda y cortada en trozos pequeños.'
		}
	},
	figs: {
		name: 'Higos',
		preparationByAge: {
			'6-9': 'Higo fresco, muy blando, cortado en mitades o cuartos a lo largo.',
			'9-12': 'Higo fresco cortado en trozos pequeños del tamaño de un bocado.'
		},
		chokingHazardWarning: 'Nunca des higos secos; son demasiado duros para masticar.'
	},
	fish: {
		name: 'Pescado',
		preparationByAge: {
			'6-9': 'Completamente cocido y sin espinas, cortado en tiras de unos 2 dedos de ancho.',
			'9-12': 'Completamente cocido y sin espinas, cortado en trozos pequeños o desmenuzado.'
		},
		chokingHazardWarning: 'Siempre revisa cuidadosamente si hay espinas pequeñas. Las espinas de pescado son un riesgo de asfixia serio.'
	},
	grapes: {
		name: 'Uvas',
		preparationByAge: {
			'6-9': 'Nunca enteras. Corta verticalmente en cuartos finos a lo largo (como tiras largas). Retira las semillas.',
			'9-12': 'Corta verticalmente en cuartos o trozos finos y largos.'
		},
		chokingHazardWarning: 'Las uvas enteras encajan perfectamente en las vías respiratorias y son una causa principal de asfixia.'
	},
	'green-beans': {
		name: 'Ejotes',
		preparationByAge: {
			'6-9': 'Al vapor o hervidos hasta que estén completamente blandos y tiernos. Déjalos enteros para que los agarre.',
			'9-12': 'Cocidos hasta que estén blandos y cortados en trozos pequeños del tamaño de un bocado.'
		}
	},
	'green-peas': {
		name: 'Guisantes',
		preparationByAge: {
			'6-9': 'Nunca enteros. Machaca completamente hasta formar una pasta espesa y suave que se pueda mezclar con otros alimentos.',
			'9-12': 'Aplasta cada guisante individualmente entre tus dedos antes de servir.'
		},
		chokingHazardWarning: 'Los guisantes enteros son redondos y pequeños, lo que los convierte en objetos de alto riesgo de asfixia.'
	},
	turkey: {
		name: 'Pavo',
		preparationByAge: {
			'6-9': 'Mezcla en una albóndiga suave o forma de hamburguesa cocida hasta que esté tierna.',
			'9-12': 'Cocido y desmenuzado en trocitos diminutos y fáciles de masticar.'
		}
	},
	guava: {
		name: 'Guayaba',
		preparationByAge: {
			'6-9': 'Guayaba muy blanda, cortada en cuartos. Retira todas las semillas duras del interior.',
			'9-12': 'Guayaba blanda, sin semillas, cortada en trozos pequeños en cubos.'
		},
		chokingHazardWarning: 'Las semillas duras dentro de una guayaba son riesgos de asfixia peligrosos.'
	},
	hazelnut: {
		name: 'Avellana',
		preparationByAge: {
			'6-9': 'Nunca entera. Mantequilla de nuez suave diluida con agua, leche materna, o mezclada en purés.',
			'9-12': 'Mantequilla de nuez suave untada en una capa fina en tiras de pan tostado o mezclada en la comida.'
		},
		chokingHazardWarning: 'Las nueces enteras o las cantidades espesas de mantequilla de nuez son riesgos de asfixia graves.'
	},
	kiwi: {
		name: 'Kiwi',
		preparationByAge: {
			'6-9': 'Pela la piel, corta en gajos gruesos verticales. Rueda en cereal si está resbaloso.',
			'9-12': 'Pela la piel, corta en cubos pequeños.'
		}
	},
	lamb: {
		name: 'Cordero',
		preparationByAge: {
			'6-9': 'Sirve una pieza grande con hueso (cartílago de la carne retirado) o una tira gruesa de carne suave.',
			'9-12': 'Carne de cordero suave finamente deshebrada.'
		}
	},
	leek: {
		name: 'Puerro',
		preparationByAge: {
			'6-9': 'Cocido en sopas o guisos hasta que esté completamente blando y con una textura derretida.',
			'9-12': 'Finamente picado y bien cocido dentro de una receta.'
		}
	},
	lentils: {
		name: 'Lentejas',
		preparationByAge: {
			'6-9': 'Bien cocidas y machacadas hasta formar una pasta espesa, o formadas en bolitas suaves de lentejas.',
			'9-12': 'Cocidas completamente hasta que estén muy blandas, servidas en cucharadas suaves agrupadas.'
		}
	},
	macadamia: {
		name: 'Nuez de Macadamia',
		preparationByAge: {
			'6-9': 'Nunca entera. Molida hasta obtener un polvo fino y bien mezclada en purés suaves.',
			'9-12': 'Mantequilla de nuez de macadamia untada en una capa muy fina sobre la comida.'
		},
		chokingHazardWarning: 'Las nueces de macadamia enteras son extremadamente duras y representan un enorme riesgo de asfixia.'
	},
	mango: {
		name: 'Mango',
		preparationByAge: {
			'6-9': 'Corta una rebanada grande y gruesa cerca del hueso. Deja algo de piel para agarre, o rueda en cereal infantil.',
			'9-12': 'Cortado en cubos pequeños o rebanadas finas.'
		},
		chokingHazardWarning: 'Los alimentos resbaladizos como el mango pueden deslizarse rápidamente hacia la garganta.'
	},
	mushrooms: {
		name: 'Champiñones',
		preparationByAge: {
			'6-9': 'Salteados o a la parrilla hasta que estén muy blandos, cortados en trozos grandes y anchos del sombrero.',
			'9-12': 'Bien cocidos y picados en trozos diminutos.'
		},
		chokingHazardWarning: 'Los champiñones crudos o poco cocidos y gomosos son difíciles de tragar.'
	},
	nopales: {
		name: 'Nopal',
		preparationByAge: {
			'6-9': 'Bien limpio de espinas, hervido o a la parrilla hasta que esté completamente tierno, cortado en tiras anchas.',
			'9-12': 'Hervido hasta que esté muy blando y finamente picado en trozos pequeños.'
		},
		chokingHazardWarning:
			'Asegúrate de que todas las espinas estén 100% retiradas. El nopal fibroso y firme puede provocar arcadas si no está bien cocido.'
	},
	oatmeal: {
		name: 'Avena',
		preparationByAge: {
			'6-9': 'Cocida espesa para que se pegue a la cuchara. Deja que el bebé practique sosteniendo una cuchara precargada.',
			'9-12': 'Cocida y formada en bolitas de avena pequeñas y suaves que el bebé pueda recoger.'
		}
	},
	onion: {
		name: 'Cebolla',
		preparationByAge: {
			'6-9': 'Cocida completamente hasta que esté transparente y muy blanda en guisos, o asada en trozos grandes.',
			'9-12': 'Finamente picada y bien cocida en recetas.'
		},
		chokingHazardWarning: 'Los aros de cebolla crudos o los trozos duros son riesgos de asfixia altos.'
	},
	papaya: {
		name: 'Papaya',
		preparationByAge: {
			'6-9': 'Madura y blanda, sin semillas, cortada en lanzas largas del tamaño de un dedo.',
			'9-12': 'Madura y blanda, cortada en cubos pequeños.'
		}
	},
	pasta: {
		name: 'Pasta',
		preparationByAge: {
			'6-9':
				'Sirve formas grandes y fáciles de sostener, como Fusilli (espirales) o Penne, cocidas hasta que estén muy blandas.',
			'9-12': 'Formas más pequeñas como Ditalini, o fideos espagueti blandos cortados.'
		}
	},
	peach: {
		name: 'Durazno',
		preparationByAge: {
			'6-9': 'Muy maduro y blando, cortado en gajos gruesos.',
			'9-12': 'Muy maduro y blando, cortado en cubos pequeños.'
		},
		chokingHazardWarning: 'Los duraznos duros y no maduros son un riesgo de asfixia.'
	},
	pear: {
		name: 'Pera',
		preparationByAge: {
			'6-9':
				'Si está dura, cocina al vapor hasta que esté blanda y corta en gajos. Si está extremadamente madura y blanda, sirve gajos crudos sin piel.',
			'9-12': 'Pera blanda cortada en cubos pequeños.'
		},
		chokingHazardWarning: 'Los trozos de pera cruda firmes o duros son riesgos de asfixia peligrosos.'
	},
	peanut: {
		name: 'Cacahuate',
		preparationByAge: {
			'6-9': 'Nunca entero. Mezcla mantequilla de cacahuate suave con un poco de agua tibia o fórmula para diluirla.',
			'9-12': 'Unta mantequilla de cacahuate suave en una capa muy fina sobre una tostada.'
		},
		chokingHazardWarning: 'Los cacahuates enteros y las cucharadas espesas de mantequilla de cacahuate son riesgos de asfixia altos.'
	},
	pecan: {
		name: 'Nuez Pecana',
		preparationByAge: {
			'6-9': 'Nunca entera. Muele finamente hasta obtener harina o mezcla mantequilla de nuez pecana diluida en cereales tibios.',
			'9-12': 'Unta mantequilla de nuez pecana en una capa muy fina sobre tiras de pan tostado.'
		},
		chokingHazardWarning: 'Las nueces pecanas enteras o los trozos grandes de nuez son riesgos de asfixia peligrosos.'
	},
	pineapple: {
		name: 'Piña',
		preparationByAge: {
			'6-9': 'Corta una pieza grande y gruesa del centro para que el bebé la chupe y roa. Descarta las hebras fibrosas.',
			'9-12': 'Finamente triturada o picada en trocitos pequeños y suaves.'
		},
		chokingHazardWarning: 'Las secciones de piña en trozos grandes o fibrosas son un alto riesgo de asfixia.'
	},
	pistachio: {
		name: 'Pistacho',
		preparationByAge: {
			'6-9': 'Nunca entero. Molido hasta obtener un polvo fino y mezclado en avena tibia o purés.',
			'9-12': 'Molido hasta obtener un polvo fino o servido como una capa fina de mantequilla de pistacho suave.'
		},
		chokingHazardWarning: 'Los pistachos enteros son un riesgo de asfixia común en niños pequeños.'
	},
	plum: {
		name: 'Ciruela',
		preparationByAge: {
			'6-9': 'Muy madura y blanda, sin hueso, cortada en rebanadas gruesas.',
			'9-12': 'Cortada en cuartos.'
		}
	},
	pork: {
		name: 'Cerdo',
		preparationByAge: {
			'6-9': 'Sirve una chuleta gruesa con hueso, sin partes sueltas, o una albóndiga de carne de cerdo molida.',
			'9-12': 'Carne de cerdo tierna finamente deshebrada.'
		}
	},
	potato: {
		name: 'Papa',
		preparationByAge: {
			'6-9': 'Papa horneada o hervida, cortada en gajos gruesos. Asegúrate de que esté blanda.',
			'9-12': 'Cortada en cubos pequeños y suaves o ligeramente machacada.'
		}
	},
	pumpkin: {
		name: 'Calabaza',
		preparationByAge: {
			'6-9': 'Cocida o asada hasta que esté completamente blanda, servida en rebanadas verticales gruesas.',
			'9-12': 'Cocida hasta que esté blanda, cortada en cubos pequeños.'
		}
	},
	quinoa: {
		name: 'Quinoa',
		preparationByAge: {
			'6-9': 'Cocida hasta que esté blanda y servida agrupada, o mezclada en un puré espeso.',
			'9-12': 'Cocida y blanda, mezclada en hamburguesas de verduras o frijoles para facilitar el agarre.'
		}
	},
	radish: {
		name: 'Rábano',
		preparationByAge: {
			'6-9': 'Hervido o al vapor hasta que esté completamente blando y suave, cortado en gajos.',
			'9-12': 'Rallado crudo en hebras muy finas y delgadas.'
		},
		chokingHazardWarning: 'Los rábanos crudos enteros o en rodajas son extremadamente duros y representan un alto riesgo de asfixia.'
	},
	raspberry: {
		name: 'Frambuesa',
		preparationByAge: {
			'6-9': 'Completamente machacada con un tenedor o mezclada en yogur/cereal.',
			'9-12': 'Aplastada entre tus dedos antes de ofrecerla.'
		},
		chokingHazardWarning: 'Las bayas enteras pueden atascarse fácilmente en la garganta.'
	},
	rice: {
		name: 'Arroz',
		preparationByAge: {
			'6-9':
				'Cocina arroz de grano corto para que quede pegajoso, y forma bolas o troncos grandes que sean fáciles de sostener.',
			'9-12': 'Sirve el arroz en grumos pegajosos. Evita los granos de arroz sueltos, secos y separados.'
		},
		chokingHazardWarning: 'El arroz suelto y seco puede hacer que el bebé tosa o inhale el grano hacia las vías respiratorias.'
	},
	sesame: {
		name: 'Sésamo',
		preparationByAge: {
			'6-9': 'Mezcla tahini (pasta de sésamo) en purés o agua tibia para diluirlo completamente.',
			'9-12': 'Sirve tahini mezclado en alimentos suaves o untado en una capa muy fina sobre la comida.'
		},
		chokingHazardWarning: 'Las pastas espesas y pegajosas pueden ser difíciles de tragar para un bebé y causar arcadas.'
	},
	shrimp: {
		name: 'Camarón',
		preparationByAge: {
			'6-9': 'Retira la cabeza, la vena y la cáscara. Pica finamente y mezcla en una albóndiga o hamburguesa suave y fácil de masticar.',
			'9-12': 'Cortado en trozos muy pequeños del tamaño de un bocado después de cocinarlo completamente.'
		},
		chokingHazardWarning:
			'Los camarones enteros o los trozos grandes tienen una textura firme y gomosa que representa un alto riesgo de asfixia.'
	},
	soy: {
		name: 'Soya',
		preparationByAge: {
			'6-9': 'Tofu suave o firme cortado en tiras gruesas del tamaño de dos dedos de un adulto.',
			'9-12': 'Tofu cortado en cubos pequeños para que el bebé lo recoja.'
		}
	},
	squid: {
		name: 'Calamar',
		preparationByAge: {
			'6-9': 'Cocina hasta que esté completamente tierno, pica muy finamente y mezcla en una receta suave o puré.',
			'9-12': 'Picado finamente en trozos diminutos. No lo ofrezcas como alimento grande para agarrar.'
		},
		chokingHazardWarning: 'El calamar tiene una textura muy dura y gomosa que lo convierte en un riesgo de asfixia grave.'
	},
	strawberries: {
		name: 'Fresas',
		preparationByAge: {
			'6-9': 'Sirve una fresa única, muy grande, entera para que el bebé la sostenga y roa.',
			'9-12': 'Cortadas en trozos pequeños en cubos. No sirvas fresas medianas o pequeñas enteras.'
		},
		chokingHazardWarning: 'Las fresas medianas o pequeñas enteras encajan perfectamente en las vías respiratorias y son de alto riesgo.'
	},
	'sweet-potato': {
		name: 'Camote',
		preparationByAge: {
			'6-9': 'Al vapor o al horno hasta que esté muy blando, cortado en tiras gruesas del tamaño del dedo de un adulto.',
			'9-12': 'Al vapor o al horno hasta que esté muy blando, cortado en cubos pequeños.'
		}
	},
	tapioca: {
		name: 'Tapioca',
		preparationByAge: {
			'6-9':
				'Cocida completamente y preparada como una tortilla o pan plano con la harina de tapioca, cortada en tiras para roer.',
			'9-12': 'Cocida blanda y mezclada en purés o mezclas de avena.'
		},
		chokingHazardWarning: 'Las perlas de tapioca grandes, crudas o sólidas son riesgos de asfixia directos.'
	},
	tofu: {
		name: 'Tofu',
		preparationByAge: {
			'6-9': 'Cortado en bastones del largo de un dedo que no se desmoronen fácilmente.',
			'9-12': 'Cortado en trozos pequeños o cubos.'
		}
	},
	tomato: {
		name: 'Tomate',
		preparationByAge: {
			'6-9': 'Corta un tomate grande en gajos anchos o rebanadas gruesas.',
			'9-12': 'Trozos de tomate finamente picados.'
		},
		chokingHazardWarning: 'Los tomates cherry enteros son riesgos de asfixia de alto riesgo. Nunca des tomates cherry enteros.'
	},
	turnip: {
		name: 'Nabo',
		preparationByAge: {
			'6-9': 'Al vapor o asado hasta que esté completamente blando, cortado en troncos gruesos del tamaño de un dedo.',
			'9-12': 'Al vapor hasta que esté blando al tenedor, cortado en cubos pequeños.'
		}
	},
	walnut: {
		name: 'Nuez',
		preparationByAge: {
			'6-9': 'Nunca entera. Muele hasta obtener una harina muy fina y mezcla en cereal tibio o purés.',
			'9-12': 'Sirve mantequilla de nuez mezclada limpiamente en otros alimentos suaves o untada en una capa muy fina.'
		},
		chokingHazardWarning: 'Las nueces enteras o los trozos grandes son riesgos de asfixia graves.'
	},
	watermelon: {
		name: 'Sandía',
		preparationByAge: {
			'6-9': 'Corta en una cuña rectangular grande y ancha con todas las semillas negras y blancas completamente retiradas.',
			'9-12': 'Sin semillas, cortada en cuadros pequeños en cubos.'
		},
		chokingHazardWarning: 'Siempre retira cada semilla. Las semillas duras son objetos de asfixia inmediatos.'
	},
	wheat: {
		name: 'Harina de Trigo',
		preparationByAge: {
			'6-9': 'Cocida en cereales suaves de trigo o usada para hacer panqueques caseros suaves y sencillos cortados en tiras.',
			'9-12': 'Productos horneados suaves o galletas caseras cortadas en cuadros pequeños del tamaño de un bocado.'
		}
	},
	'white-beans': {
		name: 'Frijoles Blancos',
		preparationByAge: {
			'6-9': 'Cocidos hasta que estén completamente blandos y machacados en una pasta para untar sobre la comida.',
			'9-12': 'Cocidos hasta que estén blandos, con cada frijol aplastado entre tus dedos.'
		},
		chokingHazardWarning: 'Los frijoles enteros y redondos son altamente peligrosos para las vías respiratorias.'
	},
	zucchini: {
		name: 'Calabacín',
		preparationByAge: {
			'6-9': 'Al vapor o asado hasta que esté blando, cortado en tiras verticales gruesas.',
			'9-12': 'Al vapor o asado hasta que esté blando, cortado en cubos pequeños.'
		}
	}
};
