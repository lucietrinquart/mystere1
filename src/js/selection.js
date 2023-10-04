import Phaser from "phaser";

var player; // désigne le sprite du joueur
var groupe_plateformes; // contient toutes les plateformes
var clavier; // pour la gestion du clavier
var cursors;
var dude2;
var dialogueText; // Déclaration de la variable de texte
var interactionActive = false;

export default class selection extends Phaser.Scene {
  constructor() {
    super({ key: "selection" }); // mettre le meme nom que le nom de la classe
  }

  preload() {
    // tous les assets du jeu sont placés dans le sous-répertoire src/assets/
    this.load.image("img_ciel", "src/assets/sky.png");

    this.load.image("Phaser_tuilesdejeu1", "src/assets/sprite_police.png");
    this.load.tilemapTiledJSON("carte1", "src/assets/map_police.json");

    this.load.image("img_plateforme", "src/assets/platform.png");
    this.load.spritesheet("img_perso", "src/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 50
    });
    this.load.spritesheet("img_perso2", "src/assets/dude2.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.image("img_porte1", "src/assets/door1.png");
    this.load.image("img_porte2", "src/assets/door2.png");
    this.load.image("img_porte3", "src/assets/door3.png");
    this.load.image("img_porte4", "src/assets/door4.png");
  }

  create() {
    const carteDuNiveau = this.add.tilemap("carte1");

    // chargement du jeu de tuiles
    const tileset = carteDuNiveau.addTilesetImage(
      "sprite_police",
      "Phaser_tuilesdejeu1"
    );
    const background = carteDuNiveau.createLayer("background", tileset);

    const tapis = carteDuNiveau.createLayer("tapis", tileset);

    const meuble1 = carteDuNiveau.createLayer("meuble1", tileset);

    const meuble2 = carteDuNiveau.createLayer("meuble2", tileset);

    const cloison = carteDuNiveau.createLayer("cloison", tileset);

    const deco = carteDuNiveau.createLayer("deco", tileset);

    groupe_plateformes = this.physics.add.staticGroup();

    this.porte3 = this.physics.add.staticSprite(300, 500, "img_porte3");
    player = this.physics.add.sprite(300, 300, "img_perso");
    this.dude2 = this.physics.add.sprite(100, 190, "img_perso2");
    this.dude2.refreshBody();
    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde

    // Créez un texte avec un fond de couleur
    dialogueText = this.add.text(0, 450, "", {
      font: "16px fantasy",
      fill: "#000000",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      padding: {
        left: 200, // Espacement à gauche
        right: 200, // Espacement à droite
        top: 20, // Espacement en haut
        bottom: 20
      }
    });

    dialogueText.setScrollFactor(0);
    dialogueText.setDepth(1);
    dialogueText.setWordWrapWidth(300);
    dialogueText.setVisible(false);

    // Gestion de l'interaction avec dude2
    this.input.keyboard.on("keydown-E", () => {
      // Vérifiez si dude2 est à proximité pour l'interaction
      var distance = Phaser.Math.Distance.Between(
        player.x,
        player.y,
        this.dude2.x,
        this.dude2.y
      );
      var dialogues = [
        "Nous sommes au commissariat",
        "Voici le tutoriel",
        "Un autre dialogue"
        // Ajoutez autant de dialogues que nécessaire
      ];

      var dialogueIndex = 0; // Indice du dialogue en cours

      // Gestion de l'interaction avec dude2
      this.input.keyboard.on("keydown-E", () => {
        if (dialogueIndex < dialogues.length) {
          // Si l'indice du dialogue est inférieur à la longueur du tableau des dialogues
          dialogueText.setText(dialogues[dialogueIndex]);
          dialogueText.setVisible(true);
          dialogueIndex++; // Passez au dialogue suivant lors du prochain appui sur E
        } else {
          // Si tous les dialogues ont été affichés, masquez le texte
          dialogueText.setVisible(false);
        }
      });
    });

    this.input.keyboard.on("keyup-E", () => {
      // Laisser le texte affiché jusqu'à ce qu'E soit relâchée
    });

    /***************************
     *  CREATION DES ANIMATIONS *
     ****************************/
    // dans cette partie, on crée les animations, à partir des spritesheet
    // chaque animation est une succession de frame à vitesse de défilement défini
    // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
    // creation de l'animation "anim_tourne_gauche" qui sera jouée sur le player lorsque ce dernier tourne à gauche
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    // animation lorsque le personnage n'avance pas
    this.anims.create({
      key: "turn",
      frames: [{ key: "img_perso", frame: 4 }],
      frameRate: 20
    });

    // animation pour tourner à droite
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "haut",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 12,
        end: 14
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "bas",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 9,
        end: 11
      }),
      frameRate: 10,
      repeat: -1
    });

    /***********************
     *  CREATION DU CLAVIER *
     ************************/
    // ceci permet de creer un clavier et de mapper des touches, connaitre l'état des touches
    deco.setCollisionByProperty({ estSolide: true });

    // On créée un nouveeau personnage : player
    this.physics.world.enable(player);

    this.physics.add.collider(player, deco);
    //  propriétées physiqyes de l'objet player :
    player.setCollideWorldBounds(true);
    clavier = this.input.keyboard.createCursorKeys();

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.setBounds(0, 0, 800, 608);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 800, 608);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  GROUPES ET ELEMENTS *
     ******************************************************/

    //  Collide the player and the groupe_etoiles with the groupe_plateformes
    this.physics.add.collider(player, groupe_plateformes);
  }

  update() {
    if (cursors.up.isDown) {
      player.setVelocityY(-160);
      player.anims.play("bas", true);
    } else if (cursors.down.isDown) {
      player.setVelocityY(160);
      player.anims.play("haut", true);
    } else if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play("right", true);
    } else {
      player.setVelocity(0);
      player.anims.play("turn");
    }

    if (Phaser.Input.Keyboard.JustDown(clavier.space) == true) {
      if (this.physics.overlap(player, this.porte1))
        this.scene.switch("niveau1");
      if (this.physics.overlap(player, this.porte2))
        this.scene.switch("niveau2");
      if (this.physics.overlap(player, this.porte3))
        this.scene.switch("niveau3");
    }
  }
}
