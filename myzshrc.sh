# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH=/Users/starhan/.oh-my-zsh

# Set name of the theme to load. Optionally, if you set this to "random"
# it'll load a random theme each time that oh-my-zsh is loaded.
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
ZSH_THEME="dracula"

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion. Case
# sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(zsh-autosuggestions)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/rsa_id"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
export TAICHI_NUM_THREADS=8
export TAICHI_REPO_DIR=/Users/starhan/taichi
export PYTHONPATH=/Users/starhan/taichi/python/:
export PATH=/Users/starhan/taichi/bin/:/Library/Frameworks/Python.framework/Versions/3.6/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Library/TeX/texbin:/Applications/Wireshark.app/Contents/MacOS
export TAICHI_NUM_THREADS=8
export TAICHI_REPO_DIR=/Users/starhan/taichi
export PYTHONPATH=/Users/starhan/taichi/python/:/Users/starhan/taichi/python/:
export PATH=/Users/starhan/taichi/bin/:/Users/starhan/taichi/bin/:/Library/Frameworks/Python.framework/Versions/3.6/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Library/TeX/texbin:/Applications/Wireshark.app/Contents/MacOS

# WebAssembly
export EMSDK=/Users/starhan/emsdk
export EM_CONFIG=/Users/starhan/.emscripten
export LLVM_ROOT=/Users/starhan/emsdk/clang/fastcomp/build_incoming_64/bin
export EMSDK_NODE=/Users/starhan/emsdk/node/8.9.1_64bit/bin/node
export EMSCRIPTEN=/Users/starhan/emsdk/emscripten/incoming
export EMSCRIPTEN_NATIVE_OPTIMIZER=/Users/starhan/emsdk/emscripten/incoming_64bit_optimizer/optimizer
export BINARYEN_ROOT=/Users/starhan/emsdk/binaryen/master_64bit_binaryen


export HADOOP_HOME=/usr/local/Cellar/hadoop/3.0.0/libexec
export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
export PATH=${PATH}:/usr/local/mysql/bin/
alias nenpm='cnpm --registry=http://rnpm.hz.netease.com/ --registryweb=http://npm.hz.netease.com/ --cache=$HOME/.nenpm/.cache --userconfig=$HOME/.nenpmrc'
export PATH=$PATH:$HOME/.rvm/bin # Add RVM to PATH for scripting
source ~/.bash_profile
export PATH="/usr/local/opt/openssl/bin:$PATH"
export PATH="/Users/starhan/emsdk:/Users/starhan/emsdk/clang/fastcomp/build_incoming_64/bin:/Users/starhan/emsdk/node/8.9.1_64bit/bin:/Users/starhan/emsdk/emscripten/incoming:/Users/starhan/emsdk/binaryen/master_64bit_binaryen/bin:$PATH"


