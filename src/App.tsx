import React from "react";
import { Calendar, Users, Building2, ArrowRight, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface AppProps {
  title?: string;
}

const App: React.FC<AppProps> = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Booking",
      description: "Book meeting rooms and offices with just a few clicks",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Coordinate with your team for better workspace utilization",
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Smart Spaces",
      description: "Find the perfect space for your needs with smart recommendations",
    },
  ];

  const stats = [
    { value: "500+", label: "Office Spaces" },
    { value: "10k+", label: "Happy Users" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const onReservationButtonClick = () => {
    navigate("/rooms");
  };

  return (
    <div className="min-h-screen bg-background flex-col justify-center items-center w-full">
      <section className="relative border-b">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold">
                Transform Your
                <span className="text-primary"> Workspace</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Discover and book the perfect office space for your team. Flexible solutions for
                modern work environments.
              </p>
              <div className="flex gap-4">
                <Button onClick={onReservationButtonClick} size="lg">
                  Check Offices <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src="https://plus.unsplash.com/premium_photo-1681487178876-a1156952ec60?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b2ZmaWNlc3xlbnwwfHwwfHx8MA%3D%3D"
                alt="Modern Office Space"
                className="rounded-lg border shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6 space-y-4">
                  <div className="text-primary">{feature.icon}</div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">4.9</span>
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-muted-foreground">on Capterra</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">4.8</span>
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-muted-foreground">on G2</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Workspace?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
            Join thousands of satisfied users who have already improved their office space
            management.
          </p>
          <Button size="lg">
            Get Started Now <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default App;
