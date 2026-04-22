import Link from "next/link";

export const metadata = {
  title: "Conditions d'utilisation — Ma Table RS",
  description: "Conditions générales d'utilisation de Ma Table RS - Le Réseau Social Culinaire",
};

export default function CUAPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-orange-500 text-sm font-bold hover:text-orange-400 transition-colors">← Retour à l'accueil</Link>
          <h1 className="text-4xl font-black mt-6 mb-2">Conditions d'utilisation</h1>
          <p className="text-white/40 text-sm">Dernière mise à jour : avril 2026 · Ma Table RS — <span className="font-mono">matable.app</span></p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-white/80 leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-white mb-3">1. Acceptation des conditions</h2>
            <p>
              En accédant à Ma Table RS, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas l'une quelconque de ces conditions, veuillez ne pas utiliser ce service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">2. Description du service</h2>
            <p>
              Ma Table RS ("le Service") est une plateforme sociale dédiée à la gastronomie et aux rencontres culinaires. Elle permet aux utilisateurs de :
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-white/70">
              <li>Créer un profil personnel avec intérêts culinaires.</li>
              <li>Découvrir et évaluer des restaurants.</li>
              <li>Partager des avis et critiques sur les plats.</li>
              <li>Réserver des tables en restaurants partenaires.</li>
              <li>Participer à un réseau de mise en relation basé sur les affinités culinaires (Nova IA).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">3. Conditions d'accès</h2>
            <p>Pour utiliser Ma Table RS, vous devez :</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-white/70">
              <li>Avoir au moins 18 ans (ou l'âge de majorité légal dans votre juridiction).</li>
              <li>Posséder une adresse email valide.</li>
              <li>Créer un compte avec des informations exactes et à jour.</li>
              <li>Être responsable de la confidentialité de votre mot de passe.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">4. Comportement utilisateur</h2>
            <p>Vous vous engagez à :</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-white/70">
              <li>Respecter les droits d'autrui et les lois applicables.</li>
              <li>Ne pas publier de contenu offensant, discriminatoire, ou illégal.</li>
              <li>Ne pas usurper l'identité d'une autre personne.</li>
              <li>Ne pas utiliser le Service à des fins commerciales sans autorisation.</li>
              <li>Ne pas contourner les mesures de sécurité ou d'accès.</li>
              <li>Ne pas télécharger de logiciels malveillants ou de contenus nuisibles.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">5. Contenu utilisateur</h2>
            <p>
              Les avis, critiques et profils que vous publiez ("Votre Contenu") restent votre propriété intellectuelle. En les publiant sur Ma Table RS, vous accordez à NovaTech OS une licence mondiale, perpétuelle et irrévocable pour utiliser, reproduire, modifier et afficher ce contenu à des fins de fonctionnement du Service.
            </p>
            <p className="mt-4">
              Ma Table RS se réserve le droit de supprimer tout contenu qui viole ces conditions ou les lois applicables, sans préavis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">6. Limitation de responsabilité</h2>
            <p>
              Ma Table RS et NovaTech OS ne sont pas responsables de :
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-white/70">
              <li>Les dommages ou pertes résultant de l'utilisation du Service.</li>
              <li>La qualité des repas ou services dans les restaurants partenaires.</li>
              <li>Les rencontres ou interactions avec d'autres utilisateurs.</li>
              <li>Les interruptions ou dysfonctionnements temporaires du Service.</li>
              <li>Les pertes de données dues à des défaillances techniques.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">7. Réservations et paiements</h2>
            <p>
              Les réservations effectuées via Ma Table RS sont traitées par Stripe Payments. Les frais de réservation ou d'accès au Service (le cas échéant) sont indiqués avant le paiement. Une fois le paiement confirmé, la réservation est considérée comme définitive. Les annulations et remboursements sont soumis à la politique spécifique du restaurant partenaire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">8. Propriété intellectuelle</h2>
            <p>
              Le design, les logos, le contenu marketing et la technologie Nova IA sont la propriété exclusive de NovaTech OS. Vous ne pouvez pas reproduire, modifier ou distribuer ces éléments sans autorisation écrite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">9. Modes de profil</h2>
            <p>
              Ma Table RS propose trois modes de profil : Business, Date et Fun. En sélectionnant un mode, vous consentez à être visible auprès d'autres utilisateurs partageant des intérêts similaires. Vous pouvez changer de mode ou passer en mode "Discret" (non visible) à tout moment depuis vos paramètres de compte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">10. Suspension et résiliation</h2>
            <p>
              NovaTech OS se réserve le droit de suspendre ou résilier votre compte si vous violez ces conditions ou comportez-vous de manière abusive. Une telle action peut être immédiate et sans préavis en cas de violation grave.
            </p>
            <p className="mt-4">
              Vous pouvez résilier votre compte à tout moment en contactant <a href="mailto:support@matable.app" className="text-orange-400 hover:underline">support@matable.app</a>. Vos données seront supprimées selon notre politique de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">11. Modifications des conditions</h2>
            <p>
              NovaTech OS peut modifier ces conditions à tout moment. Les modifications seront notifiées par email ou banneau sur le Service. La continuation de l'utilisation du Service après la notification constitue votre acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">12. Droit applicable</h2>
            <p>
              Ces conditions sont régies par les lois françaises. Tout litige découlant de l'utilisation de Ma Table RS sera soumis à la juridiction des tribunaux français.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">13. Contact</h2>
            <p>
              Pour toute question concernant ces conditions : <a href="mailto:legal@matable.app" className="text-orange-400 hover:underline">legal@matable.app</a>
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
