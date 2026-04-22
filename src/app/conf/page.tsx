import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité — Ma Table RS",
  description: "Comment Ma Table RS collecte, utilise et protège vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-orange-500 text-sm font-bold hover:text-orange-400 transition-colors">← Retour à l'accueil</Link>
          <h1 className="text-4xl font-black mt-6 mb-2">Politique de confidentialité</h1>
          <p className="text-white/40 text-sm">Dernière mise à jour : avril 2026 · Ma Table RS — <span className="font-mono">matable.app</span></p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-white/80 leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-white mb-3">1. Responsable du traitement</h2>
            <p>
              Ma Table RS est un service opéré par NovaTech OS. Pour toute question relative à vos données personnelles, vous pouvez nous contacter à l'adresse : <a href="mailto:privacy@matable.app" className="text-orange-400 hover:underline">privacy@matable.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-white/70">
              <li><strong className="text-white">Données de compte</strong> : adresse email, nom (optionnel), photo de profil (si connexion Google).</li>
              <li><strong className="text-white">Données de profil social</strong> : bio, occupation, centres d'intérêt, mode d'interaction choisi (Business, Date, Fun).</li>
              <li><strong className="text-white">Données de réservation</strong> : date, heure, nombre de couverts, numéro de téléphone (optionnel), demandes spéciales.</li>
              <li><strong className="text-white">Données de navigation</strong> : restaurants favoris, avis sur les plats, historique d'utilisation.</li>
              <li><strong className="text-white">Données techniques</strong> : adresse IP, type de navigateur, logs de connexion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-white/70">
              <li>Créer et gérer votre compte utilisateur.</li>
              <li>Proposer des suggestions de mise en relation via Nova IA (matching par affinités culinaires).</li>
              <li>Gérer vos réservations dans les restaurants partenaires.</li>
              <li>Vous envoyer des emails transactionnels (confirmation de compte, réservation).</li>
              <li>Améliorer nos services et personnaliser votre expérience.</li>
              <li>Assurer la sécurité et prévenir les fraudes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">4. Base légale</h2>
            <p>Le traitement de vos données repose sur :</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-white/70">
              <li><strong className="text-white">Exécution du contrat</strong> : pour la création de compte et les réservations.</li>
              <li><strong className="text-white">Intérêt légitime</strong> : pour l'amélioration du service et la sécurité.</li>
              <li><strong className="text-white">Consentement</strong> : pour le matching social et les suggestions Nova IA (vous pouvez passer en mode "Discret" à tout moment).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">5. Partage des données</h2>
            <p>Nous ne vendons jamais vos données. Elles peuvent être partagées avec :</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-white/70">
              <li><strong className="text-white">Les restaurants partenaires</strong> : uniquement les informations nécessaires à votre réservation (nom, email, téléphone).</li>
              <li><strong className="text-white">Nos prestataires techniques</strong> : hébergement (Railway), emails transactionnels (Resend), base de données (PostgreSQL).</li>
              <li><strong className="text-white">Google</strong> : si vous utilisez la connexion Google OAuth.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">6. Durée de conservation</h2>
            <ul className="list-disc list-inside space-y-2 text-white/70">
              <li>Données de compte : conservées tant que votre compte est actif.</li>
              <li>Données de réservation : 3 ans après la date de réservation.</li>
              <li>Logs techniques : 90 jours.</li>
              <li>Tokens de vérification email : 24 heures.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">7. Vos droits (RGPD)</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-white/70">
              <li><strong className="text-white">Droit d'accès</strong> : obtenir une copie de vos données.</li>
              <li><strong className="text-white">Droit de rectification</strong> : corriger des données inexactes.</li>
              <li><strong className="text-white">Droit à l'effacement</strong> : supprimer votre compte et vos données.</li>
              <li><strong className="text-white">Droit à la portabilité</strong> : recevoir vos données dans un format lisible.</li>
              <li><strong className="text-white">Droit d'opposition</strong> : vous opposer au traitement pour le matching IA (mode "Discret").</li>
            </ul>
            <p className="mt-4">Pour exercer ces droits : <a href="mailto:privacy@matable.app" className="text-orange-400 hover:underline">privacy@matable.app</a></p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">8. Cookies</h2>
            <p>Ma Table RS utilise uniquement des cookies strictement nécessaires au fonctionnement du service (session d'authentification). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">9. Sécurité</h2>
            <p>Vos données sont protégées par :</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-white/70">
              <li>Chiffrement des mots de passe (bcrypt).</li>
              <li>Connexions HTTPS uniquement.</li>
              <li>Base de données isolée sur Railway.</li>
              <li>Tokens de session signés (JWT).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">10. Contact & réclamations</h2>
            <p>
              Pour toute question : <a href="mailto:privacy@matable.app" className="text-orange-400 hover:underline">privacy@matable.app</a><br />
              Vous pouvez également adresser une réclamation à la <strong className="text-white">CNIL</strong> : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">www.cnil.fr</a>
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/20 text-xs">
          © 2026 Ma Table RS · NovaTech OS · <Link href="/" className="hover:text-orange-400 transition-colors">matable.app</Link>
        </div>
      </div>
    </div>
  );
}
