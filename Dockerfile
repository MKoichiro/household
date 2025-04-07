# Dockerfile
FROM node:lts-slim

# 一般ユーザーでログイン
USER node

# nodeユーザーのホームにプロジェクトを配置
WORKDIR /home/node/app

# 依存関係のキャッシュ利用のため、まず package.json と package-lock.json (存在する場合) をコピー
# USER nodeはその後のRUNとCMDにしか効かない。COPYはデフォルトでrootが行う。
COPY --chown=node package*.json ./

# コンテナ側にマウントされるdocker volumeのnode_modulesを更新
RUN npm ci

# ソースコードを全てコピー(コンテナ側でnpm installするのでnode_modules/は作られるし、/appにソースコードはボリュームマウントされるので不要では？)
# COPY . .

# Vite のデフォルトポート（通常は 5173）をコンテナ側で開放（ドキュメントとしての機能なので無くてもまあ良いよね？）
# EXPOSE 5173

# 開発サーバーを起動
CMD ["npm", "run", "dev"]
