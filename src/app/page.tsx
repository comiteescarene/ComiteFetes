export default function Home() {
  return (
    <main className='min-h-screen bg-neutral-50 text-neutral-900'>
      <div className='mx-auto max-w-4xl px-6 py-16'>
        <h1 className='text-3xl font-bold'>ne</h1>
        <p className='mt-3 text-lg'>
          Site officiel – réservation d’emplacements, évènements, newsletter.
        </p>
        <div className='mt-8 rounded-2xl border bg-white p-6 shadow-sm'>
          <p>Déploiement initial OK.</p>
          <p className='text-sm text-neutral-500'>
            Prochaine étape : base MySQL & schéma (emplacements, réservations, newsletter).
          </p>
        </div>
      </div>
    </main>
  );
}
