import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  // Vérifier que c'est une requête POST
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  const body = await readBody(event)
  const config = useRuntimeConfig()

  // Valider les données
  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      message: 'Les champs nom, email et message sont requis'
    })
  }

  // Récupérer la clé API Resend depuis les variables d'environnement
  const resendApiKey = config.resendApiKey || process.env.RESEND_API_KEY
  const recipientEmail = config.contactEmail || process.env.CONTACT_EMAIL

  // Mode développement : si Resend n'est pas configuré, on sauvegarde juste dans Supabase
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (!resendApiKey || !recipientEmail) {
    if (isDevelopment) {
      console.warn('⚠️  RESEND_API_KEY ou CONTACT_EMAIL non configurées. Mode développement activé.')
      console.warn('📧 Pour activer l\'envoi d\'emails, créez un fichier .env avec:')
      console.warn('   RESEND_API_KEY=votre_cle_api')
      console.warn('   CONTACT_EMAIL=votre-email@exemple.com')
    } else {
      console.error('RESEND_API_KEY ou CONTACT_EMAIL non configurées')
      throw createError({
        statusCode: 500,
        message: 'Configuration email manquante. Veuillez configurer RESEND_API_KEY et CONTACT_EMAIL dans votre fichier .env'
      })
    }
  }

  try {
    let emailData: any = null
    
    // Envoyer l'email seulement si Resend est configuré
    if (resendApiKey && recipientEmail) {
      const resend = new Resend(resendApiKey)

      // Préparer le contenu de l'email
      const projectTypeText = body.projectType 
        ? `\nType de projet : ${body.projectType}`
        : ''
      
      const companyText = body.company 
        ? `\nEntreprise : ${body.company}`
        : ''

      const emailContent = `
Nouveau message depuis le formulaire de contact

Nom : ${body.name}
Email : ${body.email}${companyText}${projectTypeText}

Message :
${body.message}

---
Ce message a été envoyé depuis le formulaire de contact de votre site web.
      `.trim()

      // Envoyer l'email
      const { data, error } = await resend.emails.send({
        from: 'Portfolio Contact <a.wierel@arnaudwiereldev.fr>', // Remplacez par votre domaine vérifié
        to: recipientEmail,
        replyTo: body.email,
        subject: `Nouveau message de contact - ${body.name}`,
        text: emailContent,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Nouveau message depuis le formulaire de contact</h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Nom :</strong> ${body.name}</p>
              <p><strong>Email :</strong> <a href="mailto:${body.email}">${body.email}</a></p>
              ${body.company ? `<p><strong>Entreprise :</strong> ${body.company}</p>` : ''}
              ${body.projectType ? `<p><strong>Type de projet :</strong> ${body.projectType}</p>` : ''}
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #333;">Message :</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${body.message}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Ce message a été envoyé depuis le formulaire de contact de votre site web.
            </p>
          </div>
        `
      })

      if (error) {
        console.error('Erreur Resend:', error)
        throw createError({
          statusCode: 500,
          message: `Erreur lors de l'envoi de l'email: ${error.message || 'Erreur inconnue'}`
        })
      }

      emailData = data
      console.log('✅ Email envoyé avec succès via Resend')
    } else {
      console.log('⚠️  Mode développement : email non envoyé (Resend non configuré)')
    }

    // Optionnel : Sauvegarder aussi dans Supabase si configuré
    const supabaseUrl = config.public.supabaseUrl
    const supabaseKey = config.public.supabaseKey
    
    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseKey)
        
        await supabase
          .from('contacts')
          .insert([
            {
              name: body.name,
              email: body.email,
              company: body.company || null,
              message: body.message,
              project_type: body.projectType || null,
              created_at: new Date().toISOString()
            }
          ])
      } catch (supabaseError) {
        // On continue même si Supabase échoue, l'email est déjà envoyé
        console.warn('Erreur lors de la sauvegarde Supabase:', supabaseError)
      }
    }

    return {
      success: true,
      message: resendApiKey && recipientEmail 
        ? 'Message envoyé avec succès' 
        : 'Message enregistré (mode développement - email non envoyé)',
      emailId: emailData?.id || null,
      emailSent: !!resendApiKey && !!recipientEmail
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de l\'envoi du message'
    })
  }
})

