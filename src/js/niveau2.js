// chargement des librairies
import Phaser from "phaser";
var dialogueText; // Déclaration de la variable de texte
var interactionActive = false;
export default class niveau2 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau2" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {}

  create() {
    // Créez le personnage dude2 ici

    // Créez une bulle de texte pour l'interaction
    var dialogueText = this.add.text(20, 450, "", {
      font: "16px fantasy",
      fill: "#ffffff",
      backgroundColor: "rgba(0, 0, 0, 0.7)"
    });
    dialogueText.setScrollFactor(0);
    dialogueText.setDepth(1);
    dialogueText.setWordWrapWidth(300);
    dialogueText.setVisible(false);

    // Gestion de l'interaction avec dude2
    this.input.keyboard.on("keydown-E", () => {
      // Vérifiez si dude2 est à proximité pour l'interaction
      var distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.dude2.x,
        this.dude2.y
      );
      if (distance < 50) {
        // Vous pouvez ajuster la distance selon vos besoins
        if (!interactionActive) {
          // Si l'interaction n'est pas déjà active
          dialogueText.setText("Nous sommes au commissariat");
          dialogueText.setVisible(true);
          interactionActive = true; // Marquez l'interaction comme active
        } else {
          // Si l'interaction est déjà active, appuyer de nouveau sur E la désactive
          dialogueText.setVisible(false);
          interactionActive = false;
        }
      }
    });

    this.input.keyboard.on("keyup-E", () => {
      // Laisser le texte affiché jusqu'à ce qu'E soit relâchée
    });

    this.add.image(400, 300, "img_ciel");
    this.groupe_plateformes = this.physics.add.staticGroup();
    this.groupe_plateformes.create(200, 584, "img_plateforme");
    this.groupe_plateformes.create(600, 584, "img_plateforme");
    // ajout d'un texte distintcif  du niveau
    this.add.text(400, 100, "Vous êtes dans le niveau 2", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    });

    this.player = this.physics.add.sprite(100, 1600, "img_perso");
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.dude2 = this.physics.add.sprite(200, 1600, "img_perso2");
    this.dude2.refreshBody();
    this.dude2.setBounce(0.2);
    this.dude2.setCollideWorldBounds(true);

    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.groupe_plateformes);
    this.physics.add.collider(this.dude2, this.groupe_plateformes);

    this.porte_retour = this.physics.add.staticSprite(100, 550, "img_porte1");
  }

  update() {
    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_tourne_droite", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("anim_face");
    }
    if (this.clavier.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        this.scene.switch("selection");
      }
    }
  }
}
