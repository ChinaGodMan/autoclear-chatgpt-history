name: Sync /.eslintrc.js to ( adamlui/(userscripts|chatgpt-apps|chatgpt-auto-refresh|chatgpt-infinity|chatgpt-widescreen|youtube-classic)/.eslintrc.js && kudoai/(bravegpt|duckduckgpt)/.eslintrc.js )

on:
  push:
    branches: [ master, main ]
    paths: '.eslintrc.js'

jobs:
  build:
    if: github.event.commits[0].committer.username != 'auto-sync-bot'
    runs-on: ubuntu-latest
    steps:

      - name: Checkout adamlui/userscripts
        uses: actions/checkout@v2
        with:
          token: ${{ secrets.REPO_SYNC_PAT }}
          repository: adamlui/userscripts
          path: adamlui/userscripts

      - name: Checkout adamlui/chatgpt-apps
        uses: actions/checkout@v2
        with:
          token: ${{ secrets.REPO_SYNC_PAT }}
          repository: adamlui/chatgpt-apps
          path: adamlui/chatgpt-apps

      - name: Checkout adamlui/autoclear-chatgpt-history
        uses: actions/checkout@v2
        with:
          token: ${{ secrets.REPO_SYNC_PAT }}
          repository: adamlui/autoclear-chatgpt-history
          path: adamlui/autoclear-chatgpt-history

      - name: Checkout adamlui/chatgpt-auto-refresh
        uses: actions/checkout@v2
        with:
          token: ${{ secrets.REPO_SYNC_PAT }}
          repository: adamlui/chatgpt-auto-refresh
          path: adamlui/chatgpt-auto-refresh

      - name: Checkout adamlui/chatgpt-infinity
        uses: actions/checkout@v2
        with:
          token: ${{ secrets.REPO_SYNC_PAT }}
          repository: adamlui/chatgpt-infinity
          path: adamlui/chatgpt-infinity

      - name: Checkout adamlui/chatgpt-widescreen
        uses: actions/checkout@v2
        with:
          token: ${{ secrets.REPO_SYNC_PAT }}
          repository: adamlui/chatgpt-widescreen
          path: adamlui/chatgpt-widescreen

      - name: Checkout adamlui/youtube-classic
        uses: actions/checkout@v2
        with:
          token: ${{ secrets.REPO_SYNC_PAT }}
          repository: adamlui/youtube-classic
          path: adamlui/youtube-classic

      - name: Checkout kudoai/bravegpt
        uses: actions/checkout@v2
        with:
          token: ${{ secrets.REPO_SYNC_PAT }}
          repository: kudoai/bravegpt
          path: kudoai/bravegpt

      - name: Checkout kudoai/duckduckgpt
        uses: actions/checkout@v2
        with:
          token: ${{ secrets.REPO_SYNC_PAT }}
          repository: kudoai/duckduckgpt
          path: kudoai/duckduckgpt

      - name: Sync /.eslintrc.js to adamlui/userscripts/.eslintrc.js
        run: cp -f -v ${{ github.workspace }}/adamlui/autoclear-chatgpt-history/.eslintrc.js ${{ github.workspace }}/adamlui/userscripts/.eslintrc.js

      - name: Sync /.eslintrc.js to adamlui/chatgpt-apps/.eslintrc.js
        run: cp -f -v ${{ github.workspace }}/adamlui/autoclear-chatgpt-history/.eslintrc.js ${{ github.workspace }}/adamlui/chatgpt-apps/.eslintrc.js

      - name: Sync /.eslintrc.js to adamlui/chatgpt-auto-refresh/.eslintrc.js
        run: cp -f -v ${{ github.workspace }}/adamlui/autoclear-chatgpt-history/.eslintrc.js ${{ github.workspace }}/adamlui/chatgpt-auto-refresh/.eslintrc.js

      - name: Sync /.eslintrc.js to adamlui/chatgpt-infinity/.eslintrc.js
        run: cp -f -v ${{ github.workspace }}/adamlui/autoclear-chatgpt-history/.eslintrc.js ${{ github.workspace }}/adamlui/chatgpt-infinity/.eslintrc.js

      - name: Sync /.eslintrc.js to adamlui/chatgpt-widescreen/.eslintrc.js
        run: cp -f -v ${{ github.workspace }}/adamlui/autoclear-chatgpt-history/.eslintrc.js ${{ github.workspace }}/adamlui/chatgpt-widescreen/.eslintrc.js

      - name: Sync /.eslintrc.js to adamlui/youtube-classic/.eslintrc.js
        run: cp -f -v ${{ github.workspace }}/adamlui/autoclear-chatgpt-history/.eslintrc.js ${{ github.workspace }}/adamlui/youtube-classic/.eslintrc.js

      - name: Sync /.eslintrc.js to kudoai/bravegpt/.eslintrc.js
        run: cp -f -v ${{ github.workspace }}/adamlui/autoclear-chatgpt-history/.eslintrc.js ${{ github.workspace }}/kudoai/bravegpt/.eslintrc.js

      - name: Sync /.eslintrc.js to kudoai/duckduckgpt/.eslintrc.js
        run: cp -f -v ${{ github.workspace }}/adamlui/autoclear-chatgpt-history/.eslintrc.js ${{ github.workspace }}/kudoai/duckduckgpt/.eslintrc.js

      - name: Push to adamlui/userscripts
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          push_options: '--force'
          add_options: '--all'
          commit_user_email: auto-sync@chatgptevo.com
          commit_message: '${{ github.event.head_commit.message }} ↞ [auto-sync from `adamlui/autoclear-chatgpt-history`]'
          file_pattern: '.eslintrc.js'
          repository: adamlui/userscripts

      - name: Push to adamlui/chatgpt-apps
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          push_options: '--force'
          add_options: '--all'
          commit_user_email: auto-sync@chatgptevo.com
          commit_message: '${{ github.event.head_commit.message }} ↞ [auto-sync from `adamlui/autoclear-chatgpt-history`]'
          file_pattern: '.eslintrc.js'
          repository: adamlui/chatgpt-apps

      - name: Push to adamlui/chatgpt-auto-refresh
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          push_options: '--force'
          add_options: '--all'
          commit_user_email: auto-sync@chatgptevo.com
          commit_message: '${{ github.event.head_commit.message }} ↞ [auto-sync from `adamlui/autoclear-chatgpt-history`]'
          file_pattern: '.eslintrc.js'
          repository: adamlui/chatgpt-auto-refresh

      - name: Push to adamlui/chatgpt-infinity
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          push_options: '--force'
          add_options: '--all'
          commit_user_email: auto-sync@chatgptevo.com
          commit_message: '${{ github.event.head_commit.message }} ↞ [auto-sync from `adamlui/autoclear-chatgpt-history`]'
          file_pattern: '.eslintrc.js'
          repository: adamlui/chatgpt-infinity

      - name: Push to adamlui/chatgpt-widescreen
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          push_options: '--force'
          add_options: '--all'
          commit_user_email: auto-sync@chatgptevo.com
          commit_message: '${{ github.event.head_commit.message }} ↞ [auto-sync from `adamlui/autoclear-chatgpt-history`]'
          file_pattern: '.eslintrc.js'
          repository: adamlui/chatgpt-widescreen

      - name: Push to adamlui/youtube-classic
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          push_options: '--force'
          add_options: '--all'
          commit_user_email: auto-sync@chatgptevo.com
          commit_message: '${{ github.event.head_commit.message }} ↞ [auto-sync from `adamlui/autoclear-chatgpt-history`]'
          file_pattern: '.eslintrc.js'
          repository: adamlui/youtube-classic

      - name: Push to kudoai/bravegpt
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          push_options: '--force'
          add_options: '--all'
          commit_user_email: auto-sync@chatgptevo.com
          commit_message: '${{ github.event.head_commit.message }} ↞ [auto-sync from `adamlui/autoclear-chatgpt-history`]'
          file_pattern: '.eslintrc.js'
          repository: kudoai/bravegpt

      - name: Push to kudoai/duckduckgpt
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          push_options: '--force'
          add_options: '--all'
          commit_user_email: auto-sync@chatgptevo.com
          commit_message: '${{ github.event.head_commit.message }} ↞ [auto-sync from `adamlui/autoclear-chatgpt-history`]'
          file_pattern: '.eslintrc.js'
          repository: kudoai/duckduckgpt
