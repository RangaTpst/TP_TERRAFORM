# TP Réseau — Infrastructure as Code

**Auteur :** Nicolas Rouillé

## Schéma d'architecture

```
Navigateur
    |
    | HTTPS (mkcert)
    v
Next.js (nextjs.local:3000)
    |           |
    | upload    | restore
    v           v
Bucket S3 chaud  <----  Bucket S3 froid
(bucket-hot)            (bucket-cold)
    |
    | sync (backup journalier)
    v
Bucket S3 froid
(bucket-cold)

GitHub push (master)
    |
    | webhook POST /api/webhook
    v
Next.js → gitops/deploy.sh → git pull + npm build
```

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Terraform](https://developer.hashicorp.com/terraform/install)
- [Node.js 20+](https://nodejs.org/)
- [mkcert](https://github.com/FiloSottile/mkcert)

## Démarrage

### 1. Cloner le dépôt

```bash
git clone https://github.com/RangaTpst/TP_TERRAFORM.git
cd TP_TERRAFORM
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example nextjs/.env.local
# Éditer nextjs/.env.local si besoin
```

### 3. Lancer l'infrastructure avec Terraform

```bash
cd terraform
terraform init
terraform apply
cd ..
```

Cela démarre MiniStack dans Docker et crée les deux buckets S3.

### 4. Configurer le domaine local

Ajouter dans `C:\Windows\System32\drivers\etc\hosts` (Windows) ou `/etc/hosts` (Linux/Mac) :

```
127.0.0.1   nextjs.local
127.0.0.1   grafana.nextjs.local
```

### 5. Générer les certificats HTTPS

```bash
mkcert -install
cd nextjs && mkcert nextjs.local && cd ..
cd monitoring && mkcert grafana.nextjs.local && cd ..
```

### 6. Lancer l'application Next.js

```bash
cd nextjs
npm install
npm run dev
```

L'app est accessible sur **https://nextjs.local:3000**

### 7. Lancer le monitoring (optionnel)

```bash
cd monitoring
docker compose up -d
```

Grafana accessible sur **https://grafana.nextjs.local** (admin / reseau123!)

### 8. Lancer le backup automatique

```bash
cd backup
docker compose up -d
```

Le backup tourne tous les jours à 2h du matin vers le bucket froid.

### 9. Tester l'upload et la restauration

- Ouvrir **https://nextjs.local:3000**
- Uploader un fichier via le bouton "Envoyer"
- Lancer un backup manuel : `docker compose exec backup sh /scripts/backup.sh`
- Supprimer les fichiers du bucket chaud via "Tout supprimer"
- Restaurer via "Restaurer depuis le backup"

### 10. Tester le webhook GitOps

```bash
sh scripts/test-webhook.sh
```

## Provider agnostic

| Composant local       | Équivalent cloud                        |
|-----------------------|-----------------------------------------|
| MiniStack             | AWS S3 / Scaleway Object Storage / MinIO|
| Terraform             | Terraform / OpenTofu                    |
| mkcert                | Let's Encrypt / Caddy / Traefik         |
| GitHub Actions        | GitLab CI / Gitea Actions               |
| Grafana + Prometheus  | Datadog / AWS CloudWatch                |
| Loki                  | AWS CloudWatch Logs / Papertrail        |
