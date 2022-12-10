/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { ReactComponent as SettingIcon } from './images/setting.svg';
import clannad from './data/clannad.json'
import kanon from './data/kanon.json'
import air from './data/air.json'
import planetarian from './data/planetarian.json'
import angelbeats from './data/angelbeats.json'
import littlebusters from './data/littlebusters.json'
import summerpockets from './data/summerpockets.json'
import harmonia from './data/harmonia.json'
import rewrite from './data/rewrite.json'

import up from './images/uparrow.png'
import down from './images/downarrow.png'

interface CharacterInfo {
  Name: string,
  OriginalName: string,
  Height: number | string,
  Weight: number | string,
  Birthday: string,
  FASeries: string
}


function App() {

  const months = ['null', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const ClannadInfo: CharacterInfo[] = Objfy(clannad)
  const KanonInfo: CharacterInfo[] = Objfy(kanon)
  const AirInfo: CharacterInfo[] = Objfy(air)
  const planetarianInfo: CharacterInfo[] = Objfy(planetarian)
  const angelbeatsInfo: CharacterInfo[] = Objfy(angelbeats)
  const rewriteInfo: CharacterInfo[] = Objfy(rewrite)
  const summerpocketsInfo: CharacterInfo[] = Objfy(summerpockets)
  const littlebustersInfo: CharacterInfo[] = Objfy(littlebusters)
  const harmoniaInfo: CharacterInfo[] = Objfy(harmonia)

  const allSeries = [ClannadInfo, KanonInfo, AirInfo, planetarianInfo,
    angelbeatsInfo, littlebustersInfo, summerpocketsInfo, rewriteInfo, harmoniaInfo];
  const allCharacters = allSeries.flat(1)


  let d = new Date()
  let k = parseInt(d.getFullYear().toString() + (d.getMonth() + 1).toString().padStart(2, '0') + d.getDate().toString().padStart(2, '0'))
  var myRandomFunction = seed(k);
  var randomNumber = myRandomFunction();
  let alltemp = allCharacters


  const [isNewDay, setIsNewDay] = useState(() => {
    if (localStorage.getItem('lastDay') !== JSON.stringify(k)) {
      localStorage.setItem('lastDay', JSON.stringify(k))
      return true
    } else {
      localStorage.setItem('lastDay', JSON.stringify(k))
      return false
    }
  })
  const [dailyAnswer, setDailyAnswer] = useState<CharacterInfo>(alltemp[Math.floor(randomNumber * alltemp.length)])
  const [currentLang, setCurrentLang] = useState('eng')
  const [searchText, setSearchText] = useState('')

  const [selectedSeries, setSelectedSeries] = useState([ClannadInfo, KanonInfo, AirInfo, planetarianInfo,
    angelbeatsInfo, littlebustersInfo, summerpocketsInfo, rewriteInfo])
  const [recentGuess, setRecentGuess] = useState<CharacterInfo>(() => {
    if (isNewDay) {
      localStorage.removeItem('recentguess')
      return {
        Name: 'none',
        OriginalName: 'none',
        Height: 'none',
        Weight: 'none',
        Birthday: 'none',
        FASeries: 'none'
      }
    }
    let savedC = localStorage.getItem('recentguess')
    if (savedC) {
      return JSON.parse(savedC)
    } else {
      return {
        Name: 'none',
        OriginalName: 'none',
        Height: 'none',
        Weight: 'none',
        Birthday: 'none',
        FASeries: 'none'
      }
    }
  })
  const [allGuesses, setAllGuesses] = useState<any[]>(() => {
    if (isNewDay) {
      localStorage.removeItem('allguesses')
      return []
    }
    let savedG = localStorage.getItem('allguesses')
    if (savedG) {
      return JSON.parse(savedG)
    } else {
      return []
    }
  })

  const [panelFlip1, setPanelFlip1] = useState(false)
  const [panelFlip2, setPanelFlip2] = useState(false)
  const [panelFlip3, setPanelFlip3] = useState(false)
  const [panelFlip4, setPanelFlip4] = useState(false)
  const [panelFlip5, setPanelFlip5] = useState(false)
  const [isInput, setIsInput] = useState(true)
  const [menu, setMenu] = useState(false)
  const [completionScreen, setCompletionScreen] = useState(false)
  const [alreadyGuessedName, setAlreadyGuessedName] = useState('')

  let guesscountstatic = 0;


  const GameHistorySeq = {
    'Kanon': 0,
    'AIR': 1,
    'CLANNAD': 2,
    'Planetarian': 3,
    'Tomoyo After': 4,
    'Little Busters!': 5,
    'Kud Wafter': 6,
    'Rewrite': 7,
    'Angel Beats! -1st beat-': 8
  }

  function Objfy(params: any) {
    return params.map((info: any) => {
      return {
        Name: info['English Name'],
        OriginalName: info['Original Name'],
        Height: info.Height,
        Weight: info.Weight,
        Birthday: info.Birthday,
        FASeries: info['First Appearance Series']
      }
    })
  }

  function compare(guess: any, actual: CharacterInfo) {
    let result = []
    if (!guess) {
      return [false, 'different', 'different', 'different', 'different']
    }
    if (guess.Name === actual.Name) {
      result.push(true)
    } else {
      result.push(false)
    }

    if (guess.Height === actual.Height) {
      result.push('same')
    } else if (guess.Height === null || actual.Height === null) {
      result.push('different')
    } else if (guess.Height > actual.Height) {
      result.push('lower')
    } else {
      result.push('higher')
    }

    if (guess.Weight === actual.Weight) {
      result.push('same')
    } else if (guess.Weight === null || actual.Weight === null) {
      result.push('different')
    } else if (guess.Weight > actual.Weight) {
      result.push('lower')
    } else {
      result.push('higher')
    }

    if (guess.Birthday === actual.Birthday) {
      result.push('same')
    } else if (guess.Birthday.split('/')[0] === 'None' || actual.Birthday.split('/')[0] === 'None') {
      result.push('different')
    }
    else if (parseInt(guess.Birthday.split('/')[0]) > parseInt(actual.Birthday.split('/')[0])) {
      //month higher
      result.push('lower')
    } else if (parseInt(guess.Birthday.split('/')[0]) === parseInt(actual.Birthday.split('/')[0])) {
      //month same
      if (parseInt(guess.Birthday.split('/')[1]) > parseInt(actual.Birthday.split('/')[1])) {
        //date higher
        result.push('lower')
      } else {
        //date lower
        result.push('higher')
      }
    } else {
      result.push('higher')
    }

    if (guess.FASeries === actual.FASeries) {
      result.push('same')
    } else {
      result.push('different')
    }
    return result

  }

  function seed(s: any) {
    var mask = 0xffffffff;
    var m_w = (123456789 + s) & mask;
    var m_z = (987654321 - s) & mask;

    return function () {
      m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

      var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
      result /= 4294967296;
      return result;
    }
  }

  function GameRow(prop: any) {
    guesscountstatic += 1;
    return (
      <div key={prop.props.Name} className={`gameRow ${prop.props.Name.replace(/\s+/g, '') === alreadyGuessedName ? 'Animate' : ''} ${'guess' + guesscountstatic.toString()}`} style={{ 'width': '100%' }}>
        <div className={`gameBlock Name ${prop.props.Name === dailyAnswer.Name ? 'correct' : 'wrong'}`}>
          <TextContainer prop={currentLang === 'eng' ? prop.props.Name : prop.props.OriginalName} />
        </div>
        <div className={`gameBlock Height ${compare(prop.props, dailyAnswer)[1] === 'same' ? 'correct' :
          compare(prop.props, dailyAnswer)[1] === 'different' ? 'wrong' : 'different'
          }`}>
          <TextContainer prop={prop.props.Height ? prop.props.Height + 'cm' : 'N/A'} />
          {compare(prop.props, dailyAnswer)[1] === 'same' || compare(prop.props, dailyAnswer)[1] === 'different'
            ? <div /> : <img id="bgimg" className='arrowIMG' src={compare(prop.props, dailyAnswer)[1] === 'higher' ? up : compare(prop.props, dailyAnswer)[1] === 'lower' ? down : undefined} alt="" />}

        </div>
        <div className={`gameBlock Weight ${compare(prop.props, dailyAnswer)[2] === 'same' ? 'correct' :
          compare(prop.props, dailyAnswer)[2] === 'different' ? 'wrong' : 'different'
          }`}>

          <TextContainer prop={prop.props.Weight === null ? 'N/A' : prop.props.Weight + 'kg'} />
          {compare(prop.props, dailyAnswer)[2] === 'same' || compare(prop.props, dailyAnswer)[2] === 'different'
            ? <div /> : <img id="bgimg" className='arrowIMG' src={compare(prop.props, dailyAnswer)[2] === 'higher' ? up : compare(prop.props, dailyAnswer)[2] === 'lower' ? down : undefined} alt="" />}

        </div>
        <div className={`gameBlock Birthday ${compare(prop.props, dailyAnswer)[3] === 'same' ? 'correct' :
          compare(prop.props, dailyAnswer)[3] === 'different' ? 'wrong' : 'different'
          }`}>
          <TextContainer prop={prop.props.Birthday === 'None/None' ? "N/A" : months[prop.props.Birthday.split('/')[0]] + ' ' + prop.props.Birthday.split('/')[1]} />
          {compare(prop.props, dailyAnswer)[3] === 'same' || compare(prop.props, dailyAnswer)[3] === 'different'
            ? <div /> : <img id="bgimg" className='arrowIMG' src={compare(prop.props, dailyAnswer)[3] === 'higher' ? up : compare(prop.props, dailyAnswer)[3] === 'lower' ? down : undefined} alt="" />}
        </div>
        <div className={`gameBlock Series ${prop.props.FASeries === dailyAnswer.FASeries ? 'correct' : 'wrong'}`} >
          <TextContainer prop={prop.props.FASeries} />
        </div>

      </div>
    )
  }


  function clickResult(c: any) {
    let flag: Boolean = false
    allGuesses.forEach(g => {
      if (g.props.Name === c.props.Name) {
        flag = c.props.Name
      }
    })
    if (flag) {
      alreadyGuessed(c.props.Name.replace(/\s+/g, ''))

      setSearchText('')
      return
    }
    setSearchText('')
    setPanelFlip1(false)
    setPanelFlip2(false)
    setPanelFlip3(false)
    setPanelFlip4(false)
    setPanelFlip5(false)
    localStorage.setItem('recentguess', JSON.stringify(c.props))
    setRecentGuess(c.props)
    let temp = []
    temp = allGuesses
    temp.push(c)
    localStorage.setItem('allguesses', JSON.stringify(temp))
    setAllGuesses(temp)
  }


  function alreadyGuessed(name: string) {
    setAlreadyGuessedName(name.replace(/\s+/g, ''))
    setTimeout(() => {
      setAlreadyGuessedName('')
    }, 800);
  }

  function openMenu() {
    localStorage.clear()
    setMenu(!menu)
  }
  function reset() {
    localStorage.clear()
    window.location.reload()
  }

  function TextContainer(prop: any) {
    return (
      <div className='text-container'>
        {prop.prop}
      </div>
    )
  }

  useEffect(() => {
    if (recentGuess && recentGuess.Name !== 'none') {

      setIsInput(false)
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
        setPanelFlip1(true)
      }, 200)
      setTimeout(() => {
        setPanelFlip2(true)
      }, 200 + 600)
      setTimeout(() => {
        setPanelFlip3(true)
      }, 200 + 600 * 2)
      setTimeout(() => {
        setPanelFlip4(true)
      }, 200 + 600 * 3)
      setTimeout(() => {
        setPanelFlip5(true)

      }, 200 + 600 * 4)
      setTimeout(() => {
        if (JSON.stringify(compare(recentGuess, dailyAnswer)) === JSON.stringify([true, 'same', 'same', 'same', 'same'])) {
          completeDaily()
        } else {
          setIsInput(true)
        }
      }, 200 + 600 * 5)
    }
  }, [recentGuess, dailyAnswer])

  useEffect(() => {
    console.log(k);
  }, [k])

  function completeDaily() {
    setCompletionScreen(true)
  }

  function SearchResultBlock(prop: any) {
    return (
      <div onClick={() => clickResult(prop)} className='result-row'>
        <div className="result-block">
          <TextContainer prop={currentLang === 'eng' ? prop.props.Name : prop.props.OriginalName} />
        </div>

      </div>
    )
  }

  function SearchFilter(c: CharacterInfo) {
    let fname = c.Name.split(' ')[0]
    let lname = ''
    if (c.Name.split(' ')[1]) {
      lname = c.Name.split(' ')[1]
    }
    let ofname = c.OriginalName.split(' ')[0]
    let olname = ''

    if (c.OriginalName.split(' ')[1]) {
      olname = c.OriginalName.split(' ')[1]
    }


    if (fname.substring(0, Math.min(searchText.length, fname.length)).toLowerCase() === searchText.toLowerCase()) {
      return true;
    }
    else if (ofname.substring(0, Math.min(searchText.length, ofname.length)) === searchText) {
      return true;
    }
    else if (olname !== '' && olname.substring(0, Math.min(searchText.length, olname.length)) === searchText) {
      return true;
    }
    else if ((lname.toLowerCase() + fname.toLowerCase()).startsWith(searchText.replace(' ', '').toLowerCase())) {
      return true;
    }
    else if ((fname.toLowerCase() + lname.toLowerCase()).startsWith(searchText.replace(' ', '').toLowerCase())) {
      return true;
    }
    else if (lname !== '' && lname.substring(0, Math.min(searchText.length, lname.length)).toLowerCase() === searchText.toLowerCase()) {
      return true;
    }
  }


  function SearchList() {
    let searchkey: CharacterInfo[] = alltemp
    return (
      <div className='searchListContainer'>
        <div className="searchList">
          {searchkey.filter(character => SearchFilter(character)).map((item) => {
            return (
              <SearchResultBlock props={item} key={item.Name} />
            )
          })}
        </div>
      </div>
    )

  }

  function SearchListAll() {
    let searchkey: CharacterInfo[] = alltemp

    return (
      <div className='searchListContainer noshow'>
        <div className="searchList">
          {searchkey.map((item) => {
            return (
              <SearchResultBlock props={item} key={item.Name} />
            )
          })}
        </div>
        <div className="searchListCover"></div>
      </div>
    )

  }



  return (
    <div className="App" style={{ 'margin': 'auto', 'justifyContent': 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <div onClick={() => {
        setCompletionScreen(false)
        setMenu(false)
      }} className={`menuunderlay ${menu || completionScreen ? 'menuUnderOpen' : ''}`}>

      </div>
      <div className={`results ${completionScreen ? 'resultsOpen' : ''}`}>
        <div className='resultsText'>
          You guessed it in {allGuesses.length} tries!
        </div>
      </div>
      <div style={{ 'cursor': 'default', 'fontSize': 60, 'fontWeight': '500', 'color': '#76487a' }} onClick={() => { currentLang === 'jap' ? setCurrentLang('eng') : setCurrentLang('jap') }}>
        かぎなdle
      </div>


      <div style={{ 'width': '100%' }}>
        <input

          className="searchGrid"
          id='searchinput'
          value={searchText}
          placeholder={currentLang === 'jap' ? 'キャラ' : 'Character Name'}
          type='text'
          onChange={e => setSearchText(e.target.value)}
          disabled={!isInput}
        >
        </input>
        {searchText.length > 0 ?
          <SearchList />
          :
          <SearchListAll />
        }
      </div>
      <div className='answerGrid' style={{ width: '100%', height: '100%' }}>
        <div className="gameRow" style={{ 'flexDirection': 'column' }}>
          <div className='gameRow' style={{ 'width': '100%', 'color': '#f9bf33' }}>
            <div className='gameBlock Name titleBlock'>
              <TextContainer prop={currentLang === 'jap' ? '名前' : 'Name'} />
            </div>
            <div className='gameBlock Height titleBlock'>
              <TextContainer prop={currentLang === 'jap' ? '身長' : 'Height'} />
            </div>
            <div className='gameBlock Weight titleBlock'>

              <TextContainer prop={currentLang === 'jap' ? '重さ' : 'Weight'} />

            </div>
            <div className='gameBlock Birthday titleBlock'>
              <TextContainer prop={currentLang === 'jap' ? '誕生日' : 'Birthday'} />

            </div>
            <div className='gameBlock Series titleBlock'>
              <TextContainer prop={currentLang === 'jap' ? 'シリーズ' : 'Series'} />

            </div>

          </div>
          {allGuesses ? allGuesses.length > 0 ?
            allGuesses.slice(0, allGuesses.length - 1).map(item => GameRow(item)) :
            <div />
            :
            <div>

            </div>
          }
          <div className={`gameRow ${recentGuess.Name.replace(/\s+/g, '') === alreadyGuessedName ? 'Animate' : ''} ${'guess' + allGuesses.length.toString()}`} style={{ 'width': '100%' }}>
            <div className={`flipBlock Name`}>
              <div className={`content ${panelFlip1 ? 'flipnow' : ''}`}>
                <div className="front">
                </div>
                <div className={`back ${recentGuess?.Name === dailyAnswer.Name ? 'correct' : 'wrong'
                  }`}>
                  <div className='text-container'>
                    {currentLang === 'eng'
                      ? recentGuess ? recentGuess.Name : ''
                      : recentGuess ? recentGuess.OriginalName : ''}
                  </div>
                </div>
              </div>
            </div>
            <div className='flipBlock Height'>
              <div className={`content ${panelFlip2 ? 'flipnow' : ''}`}>
                <div className="front">
                </div>
                <div className={`back ${compare(recentGuess, dailyAnswer)[1] === 'same' ? 'correct' :
                  compare(recentGuess, dailyAnswer)[1] === 'different' ? 'wrong' : 'different'
                  }`}>
                  <div className='text-container'>
                    {recentGuess ? recentGuess.Height ? recentGuess.Height + 'cm' : 'N/A' : ''}
                  </div>
                  {compare(recentGuess, dailyAnswer)[1] === 'same' || compare(recentGuess, dailyAnswer)[1] === 'different'
                    ? <div /> : <img id="bgimg" className='arrowIMG' src={compare(recentGuess, dailyAnswer)[1] === 'higher' ? up : compare(recentGuess, dailyAnswer)[1] === 'lower' ? down : undefined} alt="" />}

                </div>
              </div>
            </div>
            <div className='flipBlock Weight'>
              <div className={`content ${panelFlip3 ? 'flipnow' : ''}`}>
                <div className="front">
                </div>
                <div className={`back ${compare(recentGuess, dailyAnswer)[2] === 'same' ? 'correct' :
                  compare(recentGuess, dailyAnswer)[2] === 'different' ? 'wrong' : 'different'
                  }`}>
                  <div className='text-container'>
                    {recentGuess
                      ? recentGuess.Weight === null ? 'N/A' : recentGuess.Weight + 'kg'
                      : ''
                    }
                  </div>
                  {compare(recentGuess, dailyAnswer)[2] === 'same' || compare(recentGuess, dailyAnswer)[2] === 'different'
                    ? <div /> : <img id="bgimg" className='arrowIMG' src={compare(recentGuess, dailyAnswer)[2] === 'higher' ? up : compare(recentGuess, dailyAnswer)[2] === 'lower' ? down : undefined} alt="" />}

                </div>
              </div>
            </div>
            <div className='flipBlock Birthday'>
              <div className={`content ${panelFlip4 ? 'flipnow' : ''}`}>
                <div className="front">
                </div>
                <div className={`back ${compare(recentGuess, dailyAnswer)[3] === 'same' ? 'correct' :
                  compare(recentGuess, dailyAnswer)[3] === 'different' ? 'wrong' : 'different'
                  }`}>
                  <div className='text-container'>
                    {recentGuess
                      ? recentGuess.Birthday === 'None/None' ? "N/A" : months[parseInt(recentGuess.Birthday.split('/')[0])] + ' ' + recentGuess.Birthday.split('/')[1]
                      : ''}
                  </div>
                  {compare(recentGuess, dailyAnswer)[3] === 'same' || compare(recentGuess, dailyAnswer)[3] === 'different'
                    ? <div /> : <img id="bgimg" className='arrowIMG' src={compare(recentGuess, dailyAnswer)[3] === 'higher' ? up : compare(recentGuess, dailyAnswer)[3] === 'lower' ? down : undefined} alt="" />}

                </div>
              </div>
            </div>
            <div className='flipBlock Series' >
              <div className={`content ${panelFlip5 ? 'flipnow' : ''}`}>
                <div className="front">
                </div>
                <div className={`back ${recentGuess?.FASeries === dailyAnswer.FASeries ? 'correct' : 'wrong'
                  }`}>
                  <div className='text-container'>
                    {recentGuess ? recentGuess.FASeries : ''}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
      <div className={`menuButton ${menu ? 'menuspin' : ''}`} onClick={reset}>
        <SettingIcon></SettingIcon>
      </div>

      <div className={`settings ${menu ? 'settingsOpen' : ''}`}>

      </div>
    </div>
  )

}

export default App;
