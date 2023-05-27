"use client"
import { useState } from 'react';
import moment from 'moment';
import Image from 'next/image'
import { Button, Input, Card, CardBody } from "@material-tailwind/react";

export default function Home() {
  const [todayWeather, setTodayWeather] = useState(null)
  const [weeeklyData, setweeeklyData] = useState(null)
  const [invalid, setInvalid] = useState(null)
  const handleCitySearch = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const city = formData.get('city');
    console.log("I am here")
    try {
      const appID = process.env.APP_ID;
      console.log("APP ID " + appID)
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=350c4e9f97e2645e044a229e87b70bb9&units=metric`);
      if (response.ok) {
        const data = await response.json();
        if (data?.cod && data.cod === "404") {
          setInvalid(true)
        }
        console.log(data);
        setTodayWeather(data)
        const lat = data?.coord?.lat
        const lon = data?.coord?.lon
        const weeklyResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=350c4e9f97e2645e044a229e87b70bb9&units=metric`);
        if (weeklyResponse.ok) {
          setInvalid(false)
          const weaklyData = await weeklyResponse.json();
          console.log(weaklyData);
          if (weaklyData?.list) {
            const step = 8; // Define the step value
            const slicedData = [];
            for (let i = 8; i < weaklyData.list.length; i += step) {
              slicedData.push(weaklyData.list[i]);
            }
            setweeeklyData(slicedData);
          }
        }
      } else {
        console.error('Failed to fetch weather data:', response.status);
        setInvalid(true)
        setweeeklyData(null)
        setTodayWeather(null)
      }
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }
  }
  return (
    <section className='bg-white'>
      <h1 className='text-center text-xl font-bold pt-4'>NextJS Weather Application powered by OpenWeatherMap's API </h1>
      <div className='flex item-center justify-center pt-4'>
        <div className="relative flex w-full gap-2 md:w-max">
          <form onSubmit={handleCitySearch}>
            <Input
              type="search"
              name="city"
              label="Enter City..."
              className="pr-20"
              containerProps={{
                className: "min-w-[288px]",
              }}
            />
            <Button size="sm" className="!absolute right-1 top-1 rounded" type='submit'>
              Search
            </Button>
          </form>

        </div>
      </div>
      {invalid && <div className='text-center py-2'>
        <h1>City Not found...</h1>
      </div>}
      {todayWeather && <div className='flex item-center justify-center pt-4'>
        <Card className="w-auto shadow-lg border border-gray-300 border-solid m-4">
          <CardBody>
            <div className="flex items-center justify-center">
              <div className="w-1/3">
                <Image
                  src={`https://openweathermap.org/img/wn/${todayWeather?.weather[0]?.icon}@2x.png`}
                  width={300}
                  height={300}
                  alt='Dummy '
                />
              </div>
              <div className="w-2/3">
                <div className='flex flex-col'>
                  <h2>Today</h2>
                  <h1 className='pb-4'>{todayWeather?.name}</h1>
                  <p>Temperature: {todayWeather?.main?.temp} °C</p>
                  <p>{todayWeather?.weather[0]?.main}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row flex-wrap justify-center">
              {weeeklyData && weeeklyData.map((data, index) => (
                <Card
                  key={index}
                  className="m-2 shadow-lg border border-gray-300 border-solid flex items-center justify-center"
                >
                  <CardBody>
                    <div className="flex flex-col items-center">
                      <h2>{moment.unix(data?.dt).format('dddd')}</h2>
                      <Image src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@2x.png`} width={80} height={80} alt='Weather PNG' />
                      <h2>{data?.main?.temp} °C</h2>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

          </CardBody>
        </Card>
      </div>}
    </section>

  )
}
async function getTodayWeather(city) {
  const appID = process.env.APP_ID;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appID}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}