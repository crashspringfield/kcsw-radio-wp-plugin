window.addEventListener('load', () => {
  /**
  * State
  */
  let isPlaying = false
  let currentTrack = null


  /**
   * Pure functions
   */

  // getSec :: Int -> Int
  const getSec = time => time % 60

  // getMin :: Int -> Int -> Int
  const getMin = (time, sec) => (time - sec) / 60

  // extraZero :: Int -> String
  const extraZero = sec => sec < 10 ? '0' : ''

  // selectRandom :: [] -> a
  const selectRandom = arr => arr[Math.floor(Math.random() * arr.length)]

  // dateString :: String -> String
  const dateString = date => date.substring(0, date.indexOf(','))

  // getNext :: {} -> [] -> {}
  const getNext = (track, arr) => {
    const index = arr.indexOf(track)
    return (index + 1 >= arr.length) ? arr[0] : arr[index + 1]
  }

  // getPrevious :: {} -> [] -> {}
  const getPrevious = (track, arr) => {
    const index = arr.indexOf(track)
    return (index > 0) ? arr[index - 1] : arr[arr.length - 1]
  }


  /**
   * Displayed audioplayer functionality
   */
  document.getElementById('progress-bar').value = 0

  document.getElementById('progress-bar').addEventListener('change', () => {
    document.getElementById('audio-media').currentTime = document.getElementById('audio-media').duration * document.getElementById('progress-bar').value
  })

  document.getElementById('playpause-button').addEventListener('click', () => {
    if (isPlaying) {
      setPlaying(false)
    } else {
      playAudio()
      setPlaying(true)
    }
  })

  document.getElementById('replay10-button').addEventListener('click', () => {
    if (currentTrack !== null) {
      const media = document.getElementById('audio-media')

      media.currentTime = (media.currentTime - 10 > 0)
        ? media.currentTime - 10
        : 0
    }
  })

  document.getElementById('forward10-button').addEventListener('click', () => {
    if (currentTrack !== null) {
      const media = document.getElementById('audio-media')

      media.currentTime = (media.currentTime + 10 < media.duration)
        ? media.currentTime + 10
        : media.duration
    }
  })

  document.getElementById('previous-button').addEventListener('click', () => {
    if (currentTrack !== null) {
      const media = document.getElementById('audio-media')

      if (media.currentTime < 5) {
        playPrevious()
      } else {
        media.currentTime = 0
      }
    }
  })

  document.getElementById('next-button').addEventListener('click', () => {
    playNext()
  })


  /**
   * Player display
   */

  function updatePlayerDisplay(track) {
    const next = getNext(track, feedz)
    const previous = getPrevious(track, feedz)
    document.getElementById('podcast-name').textContent = track.podcast
    document.getElementById('podcast-title').textContent = track.title
    document.getElementById('podcast-date').textContent = dateString(track.date)
    document.getElementById('previous-podcast').textContent = previous.podcast
    document.getElementById('next-podcast').textContent = next.podcast
  }

  function resetProgressBar() {
    document.getElementById('progress-bar').value = 0
    document.getElementById('current-time').textContent = "0:00"
    document.getElementById('totral-time').textContent = "0:00"
  }

  function updateCurrentTime() {
    const media = document.getElementById('audio-media')
    const time = media.currentTime
    const sec = getSec(time)
    const min = getMin(time, sec)

    document.getElementById('current-time').textContent = `${min}:${extraZero(sec)}${Math.floor(sec)}`
    document.getElementById('progress-bar').value = time / media.duration
  }

  function totalDuration(time) {
    const sec = getSec(time)
    const min = getMin(time, sec)

    document.getElementById('total-time').textContent = `${min}:${extraZero(sec)}${Math.floor(sec)}`
  }

  function setPlaying(bool) {
    if (bool) {
      isPlaying = true
      document.getElementById('playpause-button').classList.remove('play')
      document.getElementById('playpause-button').classList.add('pause')
    } else {
      isPlaying = false
      document.getElementById('playpause-button').classList.remove('pause')
      document.getElementById('playpause-button').classList.add('play')
      document.getElementById('audio-media').pause()
    }
  }


  /**
   * Audio functions
   */

  function play(track) {
    removeAudio()
    resetProgressBar()

    currentTrack = track
    addAudio(track)
  }

  function stop() {
    removeAudio()
    resetProgressBar()

    setPlaying(false)
    currentTrack = null
  }

  function playPrevious() {
    if (currentTrack !== null) {
      currentTrack = getPrevious(currentTrack, feedz)
      removeAudio()
      updatePlayerDisplay(currentTrack)
      addAudio(currentTrack)
      setPlaying(false)
    }
  }

  function playNext() {
    if (currentTrack !== null) {
      currentTrack = getNext(currentTrack, feedz)
      removeAudio()
      updatePlayerDisplay(currentTrack)
      addAudio(currentTrack)
      setPlaying(false)
    }
  }

  function addAudio(podcast) {
    let container = document.getElementById('audio-container')

    if (container === null) {
      const body = document.getElementsByTagName('body')[0]
      container = document.createElement('div')
      container.setAttribute('id', 'audio-container')
      body.insertBefore(container, body.firstChild)
    }

    const audio = document.createElement('audio')
    audio.setAttribute('id', 'audio-media')
    container.appendChild(audio)

    const source = document.createElement('source')
    source.setAttribute('src', podcast.audio)
    audio.appendChild(source)
  }

  function playAudio() {
    const audio = document.getElementById('audio-media')
    let playPromise = audio.play()

    if (playPromise !== undefined) {
      playPromise.then(() => {
        totalDuration(audio.duration)
        updateCurrentTime()
        setPlaying(true)
      }).catch(err => {
        console.log("ERROR", err)
        setPlaying(false)
      })

      audio.addEventListener('timeupdate', () => {
        updateCurrentTime()
      })

      audio.addEventListener('ended', () => {
        playNext()
      })
    }
  }

  function removeAudio() {
    if (document.getElementById("audio-container") !== null) {
      document.getElementById("audio-container").remove()
    }
  }

  /**
   * Initialize and run
   */
  currentTrack = selectRandom(feedz)
  updatePlayerDisplay(currentTrack)
  addAudio(currentTrack)

})
