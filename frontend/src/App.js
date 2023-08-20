import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numAdults: 1,
      numChildren: 0,
      ages: [],
      cityTier: 'tier-1',
      tenure: '1-year',
      coverage: '500000',
      premium: {}, // Your premium data
      totalPremium: 0, // Total premium amount
      isAddedToCart: false,
      isPurchased: false,
    };
  }


  handleredirectcheckoutpage = () => {
    // const totalPremium = this.state.premium.reduce((total, [, premium]) => total + premium, 0);
    const totalPremium = this.state.premium;
    this.setState({ isAddedToCart: true })
    if (totalPremium !== 0) {

      // Redirect to the checkout page and pass the total premium value
      // Here you should implement your logic to add the total premium to the cart
      // and then redirect to the checkout page.
      // You can use React Router for the redirection or any other method you prefer.
      console.log("Total Premium:", totalPremium);
      // Example using React Router:
      // this.props.history.push('/checkout', { totalPremium });
    }
  };


  // handleCalculatePremium = async () => {
  //   try {
  //     const { numAdults, numChildren, ages, cityTier, tenure, coverage } = this.state;
  //     const response = await fetch('http://localhost:5000/api/calculate-premium', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         numAdults,
  //         numChildren,
  //         ages,
  //         cityTier,
  //         tenure,
  //         coverage
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch data');
  //     }

  //     const data = await response.json();
  //     const premiumData = {};
  //     let totalPremium = 0;
  //     const maxAge = Math.max(...ages.filter(age => age !== null)); // Find the maximum age

  //     data.forEach(([age, premium], index) => {
  //       const premiumEntry = {};

  //       if (age !== maxAge) {
  //         const floaterDiscount = premium * 0.5;
  //         premiumEntry.floaterDiscount = floaterDiscount;
  //         premium -= floaterDiscount;
  //       }

  //       premiumEntry.premium = premium;
  //       premiumEntry.discountedRate = premium;

  //       premiumData[age] = premiumEntry;
  //       totalPremium += premium;
  //     });

  //     this.setState({ premium: premiumData, totalPremium, isAddedToCart: false });
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  handleCalculatePremium = async () => {
    try {
      const { numAdults, numChildren, ages, cityTier, tenure, coverage } = this.state;
      const response = await fetch('http://localhost:5000/api/calculate-premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numAdults,
          numChildren,
          ages,
          cityTier,
          tenure,
          coverage,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await response.json();
      const premiumData = {};
      const updatedPremiumData = {}; // To store updated premium with discounts
      let totalPremium = 0;
      const maxAge = Math.max(...ages.filter(age => age !== null)); // Find the maximum age
      console.log(maxAge, "yeh aa rhi hai")
      data.forEach(([age, premium], index) => {
        const premiumEntry = {};
  
        if (age !== maxAge) {
          const floaterDiscount = premium * 0.5;
          premiumEntry.floaterDiscount = floaterDiscount;
          premium -= floaterDiscount;
        }
  
        premiumEntry.premium = premium;
        premiumEntry.discountedRate = premium; // Initialize discounted rate as premium
  
        premiumData[age] = premiumEntry;
        updatedPremiumData[age] = premium - (premiumEntry.floaterDiscount || 0); // Update premium with discount
        totalPremium += premium;
      });
  
      this.setState({
        premium: premiumData,
        updatedPremium: updatedPremiumData,
        totalPremium,
        isAddedToCart: false,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  handlePurchase = () => {
    this.setState({ isPurchased: true });

    // Reset after 5 seconds
    setTimeout(() => {
      this.setState({
        isAddedToCart: false,
        isPurchased: false,
        totalPremium: 0, // Reset total premium

      });
      window.location.reload()
    }, 5000);
  };

  handleChildValidation = (age, index, numChildren) => {
    console.log('Validating age:', age, 'Index:', index, 'NumChildren:', numChildren);
    age = parseInt(age);
    if (age < 0 || age > 18) {
      alert('Age for Children should be between 0 and 18.');
      this.handleChildChange(index, '');
    }
  };

  handleAdultChange = (numAdults) => {
    this.setState({ numAdults }, () => this.updateLocalStorage());
  };

  handleAgeValidation = (age, index, numAdults) => {
    console.log('Validating age:', age, 'Index:', index, 'NumAdults:', numAdults);
    age = parseInt(age);
    if (age < 18 || age > 90) {
      alert('Age for adults should be between 18 and 90.');
      this.handleAgeChange(index, '');
    }
  };

  handleChildChange = (numChildren) => {
    this.setState({ numChildren }, () => this.updateLocalStorage());
  };

  

  handleAgeChange = (index, age) => {
    const { ages } = this.state;
    ages[index] = age !== '' ? age : null;
    this.setState({ ages }, () => this.updateLocalStorage());
  };

  updateLocalStorage = () => {
    const { numAdults, numChildren, ages, cityTier, tenure, coverage } = this.state;
    const identifier = numChildren > 0 ? `${numAdults}a,${numChildren}c` : `${numAdults}a`;
    const filteredAges = ages.filter(age => age !== null);
    localStorage.setItem('selectedIdentifier', identifier);
    localStorage.setItem('selectedAges', JSON.stringify(ages));
    localStorage.setItem('selectedTier', cityTier);
    localStorage.setItem('selectedTenure', tenure);
    localStorage.setItem('selectedCoverage', coverage);
  };



  componentDidMount() {
    localStorage.removeItem('selectedAges');
    localStorage.removeItem('selectedIdentifier');

    const selectedIdentifier = localStorage.getItem('selectedIdentifier');
    if (selectedIdentifier) {
      const numAdults = parseInt(selectedIdentifier);
      const numChildren = selectedIdentifier.includes('c') ? parseInt(selectedIdentifier.split('c')[1]) : 0;
      this.setState({ numAdults, numChildren });
    }

    const selectedAges = localStorage.getItem('selectedAges');
    if (selectedAges) {
      this.setState({ ages: JSON.parse(selectedAges) });
    }

    const selectedTier = localStorage.getItem('selectedTier');
    if (selectedTier) {
      this.setState({ cityTier: selectedTier });
    }

    const selectedTenure = localStorage.getItem('selectedTenure');
    if (selectedTenure) {
      this.setState({ tenure: selectedTenure });
    }

    const selectedCoverage = localStorage.getItem('selectedCoverage');
    if (selectedCoverage) {
      this.setState({ coverage: selectedCoverage });
    }
  }

  render() {
    const { numAdults, numChildren, ages, cityTier, tenure, coverage, premium } = this.state;
    const ageRow = [];
    const premiumRow = [];
    const floaterDiscountRow = [];
    const discountedRateRow = [];

    for (const age in this.state.premium) {
      const premiumEntry = this.state.premium[age];
      const updatedPremiumEntry = this.state.updatedPremium[age];
      const { premium, floaterDiscount, discountedRate } = premiumEntry;
    
      ageRow.push(<td key={age}>{age}</td>);
      premiumRow.push(<td key={age}>{premium}</td>);
    
      if (floaterDiscount) {
        const discountPercentage = (floaterDiscount / premium) * 100;
        floaterDiscountRow.push(<td key={age}>{discountPercentage}%</td>);
      } else {
        floaterDiscountRow.push(<td key={age}></td>);
      }
    
      discountedRateRow.push(<td key={age}>{updatedPremiumEntry.discountedRate}</td>);
    }
    

    return (
      <div className="App">
        <h2>Health Insurance Premium Calculator</h2>
        <table align='CENTER'>
          {/* <thead> */}
          {/* </thead> */}
          <tbody align='LEFT'>
            <tr>
              <td>
                <label>Number of Adults:</label>
              </td>
              <td>
                <select value={numAdults} onChange={(e) => this.handleAdultChange(e.target.value)}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <option key={index} value={index + 1}>{index + 1}</option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Number of Children:</label>
              </td>
              <td>
                <select value={numChildren} onChange={(e) => this.handleChildChange(e.target.value)}>
                  {Array.from({ length: 6 }, (_, index) => (
                    <option key={index} value={index}>{index}</option>
                  ))}
                </select>
              </td>
            </tr>
            {Array.from({ length: numAdults }, (_, index) => (
              <tr key={index}>
                <td>
                  <label>Age of Adult {index + 1}:</label>
                </td>
                <td>
                  <input
                    type="number"
                    value={ages[index] || ''}
                    min={18}
                    max={90}
                    onChange={(e) => this.handleAgeChange(index, e.target.value)}
                    onBlur={(e) => this.handleAgeValidation(e.target.value, index, numAdults)}
                  />
                </td>
              </tr>
            ))}
            {Array.from({ length: numChildren }, (_, index) => (
              <tr key={index + numAdults}>
                <td>
                  <label>Age of Child {index + 1}:</label>
                </td>
                <td>
                  <input
                    type="number"
                    value={ages[index + + numAdults] || ''}
                    min={0}
                    max={18}
                    onChange={(e) => this.handleAgeChange(index + + numAdults, e.target.value)}
                    onBlur={(e) => this.handleChildValidation(e.target.value, index + + numAdults, numChildren)}
                  />
                </td>
              </tr>
            ))}

            <tr>
              <td>
                <label>Select tier of your City:</label>
              </td>
              <td>
                <select value={cityTier} onChange={(e) => this.setState({ cityTier: e.target.value })}>
                  {['tier-1', 'tier-2'].map((tier) => (
                    <option key={tier} value={tier}>{tier}</option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Tenure:</label>
              </td>

              <td>
                <select value={tenure} onChange={(e) => this.setState({ tenure: e.target.value })}>
                  {['1-year', '2-year', '3-year', '4-year', '5-year', '10-year'].map((tenure) => (
                    <option key={tenure} value={tenure}>{tenure}</option>
                  ))}
                </select></td>
            </tr>


            <tr>
              <td>
                <label>Coverage: </label>
              </td>
              <td>
                <select value={coverage} onChange={(e) => this.setState({ coverage: e.target.value })}>
                  {['500000', '700000', '1000000', '1500000', '2000000', '2500000', '3000000', '4000000', '5000000', '6000000', '7500000'].map((coverage) => (
                    <option key={coverage} value={coverage}>{coverage}</option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <button onClick={this.handleCalculatePremium}>Calculate Premium</button>
          <table align='center'>
            <thead >
              {/* <tr>
              <th>Age</th>
              <th>Base rate</th>
              <th>Floater Discount</th>
              <th>Discount rate</th>
            </tr> */}
            </thead>
            <tbody align='left'>

              <tr>
                <td>Age</td>
                {ageRow}
              </tr>
              <tr>
                <td>Premium</td>
                {premiumRow}
              </tr>
              <tr>
                <td>Floater Discount</td>
                {floaterDiscountRow}
              </tr>
              <tr>
                <td>Discounted rate</td>
                {discountedRateRow}
              </tr>
              <tr>
                <td>Total Premium</td>
                <td>{this.state.totalPremium.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>


        {this.state.totalPremium > 0 && (
          <button onClick={this.handleredirectcheckoutpage}>
            Add to cart
          </button>
        )}
        {this.state.isAddedToCart && (
          <div>
            <p>
              Your insurance has been added to the cart for {this.state.numAdults} adults and {this.state.numChildren} children
              for an amount of {this.state.totalPremium}.
            </p>
            {!this.state.isPurchased ? (
              <button onClick={this.handlePurchase}>Purchase Insurance</button>
            ) : (
              <p>Insurance has been purchased. Redirecting...</p>
            )}
          </div>
        )}
      </div >
    );
  }
}

export default App;