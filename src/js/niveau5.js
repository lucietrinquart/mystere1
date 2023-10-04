// chargement des librairies
import Phaser from "phaser";
var cursors;
var player; // désigne le sprite du joueur
var groupe_plateformes; // contient toutes les plateformes
var clavier; // pour la gestion du clavier
var calque_plateformes;

export default class niveau3 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau5" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("Phaser_tuilesdejeu3", "src/assets/sprite_opera.png");
    this.load.tilemapTiledJSON("carte3", "src/assets/map_accueil.json");
  }

  create() {
    const carteDuNiveau = this.add.tilemap("carte3");

    // chargement du jeu de tuiles
    const tileset = carteDuNiveau.addTilesetImage(
      "sprite_accueil",
      "Phaser_tuilesdejeu3"
    );
    const background1 = carteDuNiveau.createLayer("background", tileset);

    const sol = carteDuNiveau.createLayer("sol", tileset);

    const tapis = carteDuNiveau.createLayer("tapis", tileset);

    const mur = carteDuNiveau.createLayer("mur", tileset);

    const deco_murale = carteDuNiveau.createLayer("deco_murale", tileset);
    const meuble = carteDuNiveau.createLayer("meuble", tileset);

    const deco_meuble = carteDuNiveau.createLayer("deco_meuble", tileset);

    const murs_porteurs = carteDuNiveau.createLayer("murs_porteurs", tileset);

    const escalier = carteDuNiveau.createLayer("escalier", tileset);

    murs_porteurs.setCollisionByProperty({ estSolide: true });
    this.porte4 = this.physics.add.staticSprite(380, 250, "img_porte4");
    this.porte_retour = this.physics.add.staticSprite(380, 550, "img_porte1");

    // On créée un nouveeau personnage : player
    player = this.physics.add.sprite(410, 500, "img_perso");
    this.physics.world.enable(player);

    this.physics.add.collider(player, murs_porteurs);
    //  propriétées physiqyes de l'objet player :
    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde

    /***************************
     *  CREATION DES ANIMATIONS *
     ****************************/
    // dans cette partie, on crée les animations, à partir des spritesheet
    // chaque animation est une succession de frame à vitesse de défilement défini
    // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
    // creation de l'animation "anim_tourne_gauche" qui sera jouée sur le player lorsque ce dernier tourne à gauche
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    // animation lorsque le personnage n'avance pas
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20
    });

    // animation pour tourner à droite
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
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
    clavier = this.input.keyboard.createCursorKeys();

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  GROUPES ET ELEMENTS *
     ******************************************************/
    cursors = this.input.keyboard.createCursorKeys();

    //  Collide the player and the groupe_etoiles with the groupe_plateformes
    deco_meuble.setCollisionByProperty({ estSolide: true });
    this.physics.add.collider(player, deco_meuble);

    this.physics.world.setBounds(0, 0, 800, 608);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 800, 608);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);
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
      // Si aucune touche n'est enfoncée, le personnage conserve l'animation "turn".
      player.setVelocity(0);
      player.anims.play("turn");
    }
    if (Phaser.Input.Keyboard.JustDown(clavier.space) == true) {
      if (this.physics.overlap(player, this.porte4)) {
        this.scene.switch("niveau4");
      }
      if (this.physics.overlap(player, this.porte_retour)) {
        this.scene.switch("niveau3");
      }
    }
  }
}
