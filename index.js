require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env
const mongoose = require('mongoose');
const { Types: { ObjectId } } = require('mongoose');


// Définition du schéma pour une personne
const personneSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  âge: {
    type: Number
  },
  favoriteFoods: {
    type: [String]
  }
});

// Création du modèle 'Personne' à partir du schéma
const Personne = mongoose.model('Personne', personneSchema);

const personnes = [
  { nom: 'Ines', âge: 24, favoriteFoods: ['Garba', 'Pizza'] },
  { nom: 'Karen', âge: 30, favoriteFoods: ['Sushi', 'Burger'] },
];

const arrayOfPeople = [
  { nom: 'Alice', âge: 35, favoriteFoods: ['Sushi', 'Pizza'] },
  { nom: 'Bob', âge: 40, favoriteFoods: ['Burger', 'Pasta'] },
  { nom: 'Samuel', âge: 18, favoriteFoods: ['Avocat', 'Salade'] }
];

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connecté à MongoDB');

    try {
      // Suppression de toutes les données existantes de la collection 'Personne'
      await Personne.deleteMany({});

      // Création de plusieurs personnes avec Model.create()
      await Personne.create(arrayOfPeople);

      // Insérer Ines, Karen et la nouvelle personne Ange dans la base de données
      await Personne.insertMany([personnes[0], personnes[1]]);

      // Suppression de toutes les personnes dont le nom est "Mary"
      const deleteResult = await Personne.deleteMany({ nom: 'Mary' });
      console.log('Résultat de la suppression :', deleteResult);

// Recherche des personnes aimant le garba 
const personnesAimantGarba = await Personne.find({ favoriteFoods: 'Garba' })
.sort({ nom: 1 }) // Tri par nom
.limit(2) // Limite à deux documents
.select('-âge') // Masquer l'âge
.exec();
console.log('Personnes aimant le garba (limité à deux, trié par nom, sans âge) :', personnesAimantGarba);

    // Recherche d'une personne par nom et mise à jour de l'âge à 20
    const personName = 'Ines';
    const updatedPerson = await Personne.findOneAndUpdate(
      { nom: personName },
      { $set: { âge: 20 } },
      { new: true }
    );
    if (updatedPerson) {
      console.log('Personne mise à jour :', updatedPerson);
    } else {
      console.log('Aucune personne trouvée avec ce nom.');
    }


     // Recherche d'une personne à supprimer par son _id spécifique
     const Idperson = '65660a0ab0a596122d05933f'; // ID spécifique à rechercher
     const personneSupprimee = await Personne.findOneAndDelete({ _id: Idperson });
     if (personneSupprimee) {
       console.log('Personne supprimée :', personneSupprimee);
     } else {
       console.log('Aucune personne trouvée avec cet _id pour la suppression.');
     }


      // Recherche d'une personne ayant un aliment spécifique dans ses favoris (par exemple, 'Pizza')
      const food = 'Garba';
      const personneAvecAlimentSpecifique = await Personne.findOne({ favoriteFoods: food });
      console.log('Personne avec l\'aliment spécifique:', personneAvecAlimentSpecifique);

      // Recherche des personnes ayant un prénom spécifique (par exemple, 'Ines')
      const personnesAvecNomSpecifique = await Personne.find({ nom: 'Ines' });
      console.log('Personnes avec le prénom spécifique :', personnesAvecNomSpecifique);

      // Recherche d'une personne ayant un _id spécifique (par exemple, 'personId')
      const personId = '65660a0ab0a596122d05933f'; // ID spécifique à rechercher
      const bonbon = 'bonbon';
      const personneTrouvee = await Personne.findById(personId);


      if (personneTrouvee) {
        // Ajout de 'bonbon' à la liste des aliments préférés
        personneTrouvee.favoriteFoods.push(bonbon);

        // Enregistrement des modifications apportées à la personne
        await personneTrouvee.save();
        console.log('Personne mise à jour :', personneTrouvee);
      } else {
        console.log('Aucune personne trouvée avec cet _id.');
      }

      // Récupération de la liste des personnes depuis la base de données
      const listePersonnes = await Personne.find();
      console.log('Liste des toutes les personnes :', listePersonnes);
    } catch (err) {
      console.error('Erreur lors de l\'opération sur la base de données :', err);
    } finally {
      mongoose.disconnect(); // Déconnexion après les opérations sur la base de données
    }
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err.message);
  });
