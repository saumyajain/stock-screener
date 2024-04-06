const requestTopGainersInfo = () => async dispatch => {
  try {
    dispatch({
      type: 'FETCHING_MOUNTED_STOCKS',
    });

    const response = await fetch(
      'https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=fd5ccaaa835e962f809f6ad5ac53c6c7',
    );
    const data = await response.json();
    console.log(data);

    await dispatch({
      type: 'RECEIVED_STOCKS_TOP_GAINERS',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'ERROR_FETCHING_STOCKS_TOP_GAINERS',
      payload: error,
    });
  }
};

export default requestTopGainersInfo;
