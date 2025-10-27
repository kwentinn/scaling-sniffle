import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      title: "Puissance 4",
      player: "Joueur",
      currentTurn: "Tour du joueur",
      wins: "Le joueur {{player}} a gagné !",
      draw: "Match nul !",
      newGame: "Nouvelle partie",
      language: "Langue",
      dropPiece: "Déposer le pion dans la colonne {{column}}"
    }
  },
  en: {
    translation: {
      title: "Connect Four",
      player: "Player",
      currentTurn: "Current player",
      wins: "Player {{player}} wins!",
      draw: "It's a draw!",
      newGame: "New Game",
      language: "Language",
      dropPiece: "Drop piece in column {{column}}"
    }
  },
  it: {
    translation: {
      title: "Forza Quattro",
      player: "Giocatore",
      currentTurn: "Giocatore corrente",
      wins: "Il giocatore {{player}} ha vinto!",
      draw: "È un pareggio!",
      newGame: "Nuova Partita",
      language: "Lingua",
      dropPiece: "Inserisci il gettone nella colonna {{column}}"
    }
  },
  oc: {
    translation: {
      title: "Potència 4",
      player: "Jogaire",
      currentTurn: "Torn del jogaire",
      wins: "Lo jogaire {{player}} a ganhat!",
      draw: "Egalitat!",
      newGame: "Partida novèla",
      language: "Lenga",
      dropPiece: "Depausar lo pion dins la colomna {{column}}"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
